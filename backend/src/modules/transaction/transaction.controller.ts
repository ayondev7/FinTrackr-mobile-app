import { Response } from 'express';
import prisma from '../../config/database';
import { ApiError, asyncHandler, sendSuccess } from '../../utils/apiHelpers';
import { AuthRequest } from '../../middleware/auth';
import { createTransactionSchema, updateTransactionSchema } from './transaction.validation';

export const getTransactions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Get transactions request for user:', userId);

  const { type, categoryId, walletId, startDate, endDate, isRecurring } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const skip = (page - 1) * limit;

  const where: any = {
    userId,
  };

  if (type) where.type = type;
  if (categoryId) where.categoryId = categoryId;
  if (walletId) where.walletId = walletId;
  if (isRecurring !== undefined) where.isRecurring = isRecurring === 'true';
  
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate as string);
    if (endDate) where.date.lte = new Date(endDate as string);
  }

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
        wallet: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: { date: 'desc' },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  console.log('Transactions retrieved:', transactions.length);

  sendSuccess(res, {
    transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
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
      wallet: {
        select: {
          id: true,
          name: true,
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

  if (validatedData.walletId) {
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: validatedData.walletId,
        userId,
      },
    });

    if (!wallet) {
      throw new ApiError(404, 'Wallet not found');
    }
  }

  const transaction = await prisma.transaction.create({
    data: {
      ...validatedData,
      date: new Date(validatedData.date),
      nextDueDate: validatedData.nextDueDate ? new Date(validatedData.nextDueDate) : null,
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
      wallet: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
  });

  const amountChange = validatedData.type === 'expense' ? -validatedData.amount : validatedData.amount;

  await prisma.user.update({
    where: { id: userId },
    data: {
      currentBalance: {
        increment: amountChange,
      },
    },
  });

  if (validatedData.walletId) {
    await prisma.wallet.update({
      where: { id: validatedData.walletId },
      data: {
        balance: {
          increment: amountChange,
        },
      },
    });
  }

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

  if (validatedData.walletId) {
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: validatedData.walletId,
        userId,
      },
    });

    if (!wallet) {
      throw new ApiError(404, 'Wallet not found');
    }
  }

  const oldAmountChange = existingTransaction.type === 'expense' ? -existingTransaction.amount : existingTransaction.amount;

  const transaction = await prisma.transaction.update({
    where: { id: req.params.id },
    data: {
      ...validatedData,
      date: validatedData.date ? new Date(validatedData.date) : undefined,
      nextDueDate: validatedData.nextDueDate ? new Date(validatedData.nextDueDate) : undefined,
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
      wallet: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
  });

  const newAmountChange = transaction.type === 'expense' ? -transaction.amount : transaction.amount;
  const balanceDiff = newAmountChange - oldAmountChange;

  if (balanceDiff !== 0) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        currentBalance: {
          increment: balanceDiff,
        },
      },
    });

    if (transaction.walletId) {
      await prisma.wallet.update({
        where: { id: transaction.walletId },
        data: {
          balance: {
            increment: balanceDiff,
          },
        },
      });
    }
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

  await prisma.transaction.delete({
    where: { id: req.params.id },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      currentBalance: {
        increment: amountChange,
      },
    },
  });

  if (transaction.walletId) {
    await prisma.wallet.update({
      where: { id: transaction.walletId },
      data: {
        balance: {
          increment: amountChange,
        },
      },
    });
  }

  console.log('Transaction deleted successfully');

  sendSuccess(res, null, 'Transaction deleted successfully');
});

export const getTransactionStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Get transaction stats for user:', userId);

  const { startDate, endDate } = req.query;

  const where: any = {
    userId,
  };

  if (startDate || endDate) {
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
