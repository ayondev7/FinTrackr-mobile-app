import { Response } from 'express';
import prisma from '../../config/database';
import { ApiError, asyncHandler, sendSuccess } from '../../utils/apiHelpers';
import { AuthRequest } from '../../middleware/auth';
import { createTransactionSchema, updateTransactionSchema } from './transaction.validation';
import { sendNotificationToUser } from '../notifications/notification.service';

// Helper function to get date range for time period
const getDateRangeForTimePeriod = (timePeriod: string) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (timePeriod) {
    case 'daily':
      return {
        start: startOfDay,
        end: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1),
      };
    case 'weekly':
      const startOfWeek = new Date(startOfDay);
      startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
      return {
        start: startOfWeek,
        end: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1),
      };
    case 'monthly':
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      return { start: startOfMonth, end: endOfMonth };
    case 'yearly':
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      return { start: startOfYear, end: endOfYear };
    default:
      return null;
  }
};

export const getTransactions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Get transactions request for user:', userId);

  const { type, categoryId, startDate, endDate, timePeriod, sortBy } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 15;
  const skip = (page - 1) * limit;

  const where: any = {
    userId,
  };

  // Filter by type (all, expense, revenue)
  if (type && type !== 'all') {
    where.category = { type: (type as string).toUpperCase() };
  }
  
  if (categoryId) where.categoryId = categoryId;
  
  // Handle time period filter (daily, weekly, monthly, yearly)
  if (timePeriod) {
    const dateRange = getDateRangeForTimePeriod(timePeriod as string);
    if (dateRange) {
      where.date = {
        gte: dateRange.start,
        lte: dateRange.end,
      };
    }
  } else if (startDate || endDate) {
    // Fallback to explicit startDate/endDate if no timePeriod
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate as string);
    if (endDate) where.date.lte = new Date(endDate as string);
  }

  // Handle sorting (date or amount)
  const orderBy: any = sortBy === 'amount' 
    ? { amount: 'desc' } 
    : { date: 'desc' };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
            type: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  // Format transactions for frontend
  const formattedTransactions = transactions.map((txn) => ({
    id: txn.id,
    type: txn.category?.type?.toLowerCase() || 'expense',
    amount: txn.amount,
    category: txn.category?.name || 'Uncategorized',
    categoryId: txn.categoryId,
    categoryIcon: txn.category?.icon,
    categoryColor: txn.category?.color,
    accountType: txn.accountType,
    name: txn.name,
    description: txn.description,
    date: txn.date.toISOString(),
    createdAt: txn.createdAt.toISOString(),
  }));

  console.log('Transactions retrieved:', formattedTransactions.length);

  sendSuccess(res, {
    transactions: formattedTransactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit),
    },
  }, 'Transactions retrieved successfully');
});

export const getTransactionById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Get transaction by ID:', req.params.id);

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: req.params.id,
      userId,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
          color: true,
          type: true,
        },
      },
    },
  });

  if (!transaction) {
    throw new ApiError(404, 'Transaction not found');
  }

  console.log('Transaction retrieved successfully');

  sendSuccess(res, transaction, 'Transaction retrieved successfully');
});

// Helper to get balance field from account type
const getBalanceField = (accountType: string): 'cashBalance' | 'bankBalance' | 'digitalBalance' => {
  switch (accountType) {
    case 'CASH': return 'cashBalance';
    case 'BANK': return 'bankBalance';
    case 'DIGITAL': return 'digitalBalance';
    default: return 'cashBalance';
  }
};

export const createTransaction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Create transaction request for user:', userId);

  const validatedData = createTransactionSchema.parse(req.body);

  // Use Prisma transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx) => {
    // 1. Verify category exists and belongs to user
    const category = await tx.category.findFirst({
      where: {
        id: validatedData.categoryId,
        userId,
      },
    });

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    // Get user for notification preferences and currency
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        currency: true,
        notifyTransactions: true,
        notifyBudgetAlerts: true,
      },
    });

    // Remove type from validated data since it's determined by category
    const { type: _type, ...transactionData } = validatedData;

    // 2. Create the transaction
    const transaction = await tx.transaction.create({
      data: {
        ...transactionData,
        date: new Date(validatedData.date),
        userId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
            type: true,
          },
        },
      },
    });

    // 3. Update user balance based on transaction type and account
    const isExpense = category.type === 'EXPENSE';
    const amountChange = isExpense ? -validatedData.amount : validatedData.amount;
    const balanceField = getBalanceField(validatedData.accountType);

    await tx.user.update({
      where: { id: userId },
      data: {
        [balanceField]: {
          increment: amountChange,
        },
      },
    });

    // 4. If expense, update budget spent amount for the current period
    let budgetAlertType: 'warning' | 'exceeded' | null = null;
    let budgetInfo: { categoryName: string; spent: number; limit: number } | null = null;

    if (isExpense) {
      const now = new Date();
      const activeBudget = await tx.budget.findFirst({
        where: {
          userId,
          categoryId: validatedData.categoryId,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      });

      if (activeBudget) {
        const newSpent = activeBudget.spent + validatedData.amount;
        const percentage = (newSpent / activeBudget.limit) * 100;

        await tx.budget.update({
          where: { id: activeBudget.id },
          data: {
            spent: {
              increment: validatedData.amount,
            },
          },
        });

        // Check for budget alerts
        if (percentage >= 100 && !activeBudget.exceededAlertSentAt) {
          budgetAlertType = 'exceeded';
          budgetInfo = {
            categoryName: category.name,
            spent: newSpent,
            limit: activeBudget.limit,
          };

          await tx.budget.update({
            where: { id: activeBudget.id },
            data: { exceededAlertSentAt: now },
          });
        } else if (percentage >= activeBudget.alertThreshold && percentage < 100 && !activeBudget.warningAlertSentAt) {
          budgetAlertType = 'warning';
          budgetInfo = {
            categoryName: category.name,
            spent: newSpent,
            limit: activeBudget.limit,
          };

          await tx.budget.update({
            where: { id: activeBudget.id },
            data: { warningAlertSentAt: now },
          });
        }
      }
    }

    return { transaction, user, isExpense, budgetAlertType, budgetInfo };
  });

  // Send notifications after transaction completes (non-blocking)
  const { transaction, user, isExpense, budgetAlertType, budgetInfo } = result;

  // Transaction notification
  if (user?.notifyTransactions) {
    const sign = isExpense ? '-' : '+';
    const formattedAmount = `${sign}${user.currency} ${validatedData.amount.toFixed(2)}`;

    sendNotificationToUser(userId, {
      title: 'Transaction Added',
      body: `${transaction.category.name}: ${formattedAmount}`,
      data: { type: 'transaction', transactionId: transaction.id },
    }).catch((err) => console.error('Failed to send transaction notification:', err));
  }

  // Budget alert notification
  if (user?.notifyBudgetAlerts && budgetAlertType && budgetInfo) {
    const percentage = Math.round((budgetInfo.spent / budgetInfo.limit) * 100);

    if (budgetAlertType === 'exceeded') {
      const exceededBy = budgetInfo.spent - budgetInfo.limit;
      sendNotificationToUser(userId, {
        title: '🚨 Budget Exceeded',
        body: `${budgetInfo.categoryName}: You've exceeded your ${user.currency} ${budgetInfo.limit} budget by ${user.currency} ${exceededBy.toFixed(2)}!`,
        data: { type: 'budget_exceeded', categoryName: budgetInfo.categoryName },
      }).catch((err) => console.error('Failed to send budget exceeded notification:', err));
    } else {
      sendNotificationToUser(userId, {
        title: '⚠️ Budget Warning',
        body: `${budgetInfo.categoryName}: You've used ${percentage}% of your ${user.currency} ${budgetInfo.limit} budget. Be careful!`,
        data: { type: 'budget_warning', categoryName: budgetInfo.categoryName },
      }).catch((err) => console.error('Failed to send budget warning notification:', err));
    }
  }

  console.log('Transaction created successfully:', transaction.id);

  sendSuccess(res, transaction, 'Transaction created successfully', 201);
});

export const updateTransaction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  const transactionId = req.params.id;
  console.log('Update transaction request:', transactionId);

  const validatedData = updateTransactionSchema.parse(req.body);

  // Use Prisma transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx) => {
    // 1. Get existing transaction with category
    const existingTransaction = await tx.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
      include: {
        category: {
          select: {
            id: true,
            type: true,
          },
        },
      },
    });

    if (!existingTransaction) {
      throw new ApiError(404, 'Transaction not found');
    }

    // 2. Verify new category if changing
    let newCategory = existingTransaction.category;
    if (validatedData.categoryId && validatedData.categoryId !== existingTransaction.categoryId) {
      const category = await tx.category.findFirst({
        where: {
          id: validatedData.categoryId,
          userId,
        },
      });

      if (!category) {
        throw new ApiError(404, 'Category not found');
      }
      newCategory = category;
    }

    // Remove type from validated data since it's determined by category
    const { type: _type, ...updateData } = validatedData;

    // Calculate old balance impact
    const oldIsExpense = existingTransaction.category.type === 'EXPENSE';
    const oldBalanceField = getBalanceField(existingTransaction.accountType);
    const oldAmountChange = oldIsExpense ? -existingTransaction.amount : existingTransaction.amount;

    // 3. Update the transaction
    const transaction = await tx.transaction.update({
      where: { id: transactionId },
      data: {
        ...updateData,
        date: validatedData.date ? new Date(validatedData.date) : undefined,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
            type: true,
          },
        },
      },
    });

    // Calculate new balance impact
    const newIsExpense = newCategory.type === 'EXPENSE';
    const newBalanceField = getBalanceField(transaction.accountType);
    const newAmountChange = newIsExpense ? -transaction.amount : transaction.amount;

    // 4. Update user balances
    if (oldBalanceField === newBalanceField) {
      const diff = newAmountChange - oldAmountChange;
      if (diff !== 0) {
        await tx.user.update({
          where: { id: userId },
          data: {
            [newBalanceField]: {
              increment: diff,
            },
          },
        });
      }
    } else {
      // Account type changed - revert old and apply new
      await tx.user.update({
        where: { id: userId },
        data: {
          [oldBalanceField]: {
            decrement: oldAmountChange,
          },
          [newBalanceField]: {
            increment: newAmountChange,
          },
        },
      });
    }

    // 5. Update budget spent amounts
    const now = new Date();

    // If old transaction was expense, decrement old budget
    if (oldIsExpense) {
      const oldBudget = await tx.budget.findFirst({
        where: {
          userId,
          categoryId: existingTransaction.categoryId,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      });

      if (oldBudget) {
        await tx.budget.update({
          where: { id: oldBudget.id },
          data: {
            spent: {
              decrement: existingTransaction.amount,
            },
          },
        });
      }
    }

    // If new transaction is expense, increment new budget
    if (newIsExpense) {
      const newBudget = await tx.budget.findFirst({
        where: {
          userId,
          categoryId: transaction.categoryId,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      });

      if (newBudget) {
        await tx.budget.update({
          where: { id: newBudget.id },
          data: {
            spent: {
              increment: transaction.amount,
            },
          },
        });
      }
    }

    return transaction;
  });

  console.log('Transaction updated successfully');

  sendSuccess(res, result, 'Transaction updated successfully');
});

export const deleteTransaction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  const transactionId = req.params.id;
  console.log('Delete transaction request:', transactionId);

  // Use Prisma transaction to ensure atomicity
  await prisma.$transaction(async (tx) => {
    // 1. Get transaction with category
    const transaction = await tx.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
      include: {
        category: {
          select: {
            id: true,
            type: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new ApiError(404, 'Transaction not found');
    }

    const isExpense = transaction.category.type === 'EXPENSE';
    const balanceField = getBalanceField(transaction.accountType);
    // Revert the balance: add back for expense, subtract for revenue
    const amountChange = isExpense ? transaction.amount : -transaction.amount;

    // 2. Delete the transaction
    await tx.transaction.delete({
      where: { id: transactionId },
    });

    // 3. Revert user balance
    await tx.user.update({
      where: { id: userId },
      data: {
        [balanceField]: {
          increment: amountChange,
        },
      },
    });

    // 4. If was expense, decrement budget spent
    if (isExpense) {
      const now = new Date();
      const activeBudget = await tx.budget.findFirst({
        where: {
          userId,
          categoryId: transaction.categoryId,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      });

      if (activeBudget) {
        await tx.budget.update({
          where: { id: activeBudget.id },
          data: {
            spent: {
              decrement: transaction.amount,
            },
          },
        });
      }
    }
  });

  console.log('Transaction deleted successfully');

  sendSuccess(res, null, 'Transaction deleted successfully');
});

export const getTransactionStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Get transaction stats for user:', userId);

  const { startDate, endDate, timePeriod } = req.query;

  const where: any = {
    userId,
  };

  // Handle time period filter (daily, weekly, monthly, yearly)
  if (timePeriod) {
    const dateRange = getDateRangeForTimePeriod(timePeriod as string);
    if (dateRange) {
      where.date = {
        gte: dateRange.start,
        lte: dateRange.end,
      };
    }
  } else if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate as string);
    if (endDate) where.date.lte = new Date(endDate as string);
  }

  const [totalExpense, totalRevenue, transactionCount] = await Promise.all([
    prisma.transaction.aggregate({
      where: { ...where, category: { type: 'EXPENSE' } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { ...where, category: { type: 'REVENUE' } },
      _sum: { amount: true },
    }),
    prisma.transaction.count({ where }),
  ]);

  const stats = {
    totalExpense: totalExpense._sum.amount || 0,
    totalRevenue: totalRevenue._sum.amount || 0,
    netIncome: (totalRevenue._sum.amount || 0) - (totalExpense._sum.amount || 0),
    transactionCount,
  };

  console.log('Transaction stats retrieved successfully');

  sendSuccess(res, stats, 'Transaction stats retrieved successfully');
});
