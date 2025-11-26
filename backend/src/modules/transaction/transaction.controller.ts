import { Response } from 'express';
import prisma from '../../config/database';
import { ApiError, asyncHandler, sendSuccess } from '../../utils/apiHelpers';
import { AuthRequest } from '../../middleware/auth';
import { createTransactionSchema, updateTransactionSchema } from './transaction.validation';

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
    where.type = type;
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
    type: txn.type,
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

export const createTransaction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Create transaction request for user:', userId);

  const validatedData = createTransactionSchema.parse(req.body);

  const category = await prisma.category.findFirst({
    where: {
      id: validatedData.categoryId,
      userId,
    },
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  const transaction = await prisma.transaction.create({
    data: {
      ...validatedData,
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
        },
      },
    },
  });

  const amountChange = validatedData.type === 'expense' ? -validatedData.amount : validatedData.amount;
  const balanceField = validatedData.accountType === 'CASH' ? 'cashBalance' :
                       validatedData.accountType === 'BANK' ? 'bankBalance' :
                       'digitalBalance';

  await prisma.user.update({
    where: { id: userId },
    data: {
      [balanceField]: {
        increment: amountChange,
      },
    },
  });

  console.log('Transaction created successfully:', transaction.id);

  sendSuccess(res, transaction, 'Transaction created successfully', 201);
});

export const updateTransaction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Update transaction request:', req.params.id);

  const validatedData = updateTransactionSchema.parse(req.body);

  const existingTransaction = await prisma.transaction.findFirst({
    where: {
      id: req.params.id,
      userId,
    },
  });

  if (!existingTransaction) {
    throw new ApiError(404, 'Transaction not found');
  }

  if (validatedData.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: validatedData.categoryId,
        userId,
      },
    });

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
  }

  // Calculate old balance impact
  const oldBalanceField = existingTransaction.accountType === 'CASH' ? 'cashBalance' :
                          existingTransaction.accountType === 'BANK' ? 'bankBalance' :
                          'digitalBalance';
  const oldAmountChange = existingTransaction.type === 'expense' ? -existingTransaction.amount : existingTransaction.amount;

  const transaction = await prisma.transaction.update({
    where: { id: req.params.id },
    data: {
      ...validatedData,
      date: validatedData.date ? new Date(validatedData.date) : undefined,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
          color: true,
        },
      },
    },
  });

  // Calculate new balance impact
  const newBalanceField = transaction.accountType === 'CASH' ? 'cashBalance' :
                          transaction.accountType === 'BANK' ? 'bankBalance' :
                          'digitalBalance';
  const newAmountChange = transaction.type === 'expense' ? -transaction.amount : transaction.amount;

  if (oldBalanceField === newBalanceField) {
    const diff = newAmountChange - oldAmountChange;
    if (diff !== 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          [newBalanceField]: {
            increment: diff,
          },
        },
      });
    }
  } else {
    // Account type changed, revert old and apply new
    await prisma.user.update({
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

  console.log('Transaction updated successfully');

  sendSuccess(res, transaction, 'Transaction updated successfully');
});

export const deleteTransaction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Delete transaction request:', req.params.id);

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: req.params.id,
      userId,
    },
  });

  if (!transaction) {
    throw new ApiError(404, 'Transaction not found');
  }

  const amountChange = transaction.type === 'expense' ? transaction.amount : -transaction.amount;
  const balanceField = transaction.accountType === 'CASH' ? 'cashBalance' :
                       transaction.accountType === 'BANK' ? 'bankBalance' :
                       'digitalBalance';

  await prisma.transaction.delete({
    where: { id: req.params.id },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      [balanceField]: {
        increment: amountChange,
      },
    },
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
      where: { ...where, type: 'expense' },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { ...where, type: 'revenue' },
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
