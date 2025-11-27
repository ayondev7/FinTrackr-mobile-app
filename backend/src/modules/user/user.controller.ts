import { Response } from 'express';
import prisma from '../../config/database';
import { ApiError, asyncHandler, sendSuccess } from '../../utils/apiHelpers';
import { AuthRequest } from '../../middleware/auth';
import { updateProfileSchema, updateBalanceSchema } from './user.validation';

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Get profile request for user:', userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      currency: true,
      cashBalance: true,
      bankBalance: true,
      digitalBalance: true,
      theme: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  console.log('Profile retrieved successfully');

  sendSuccess(res, user, 'Profile retrieved successfully');
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Update profile request for user:', userId);

  const validatedData = updateProfileSchema.parse(req.body);

  const user = await prisma.user.update({
    where: { id: userId },
    data: validatedData,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      currency: true,
      cashBalance: true,
      bankBalance: true,
      digitalBalance: true,
      theme: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  console.log('Profile updated successfully');

  sendSuccess(res, user, 'Profile updated successfully');
});

export const updateBalance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Update balance request for user:', userId);

  const validatedData = updateBalanceSchema.parse(req.body);

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      cashBalance: validatedData.cashBalance,
      bankBalance: validatedData.bankBalance,
      digitalBalance: validatedData.digitalBalance,
      ...(validatedData.currency && { currency: validatedData.currency }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      currency: true,
      cashBalance: true,
      bankBalance: true,
      digitalBalance: true,
      theme: true,
    },
  });

  console.log('Balance updated successfully');

  sendSuccess(res, user, 'Balance updated successfully');
});

export const deleteAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Delete account request for user:', userId);

  await prisma.user.delete({
    where: { id: userId },
  });

  console.log('Account deleted successfully');

  sendSuccess(res, null, 'Account deleted successfully');
});

export const clearUserData = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Clear user data request for user:', userId);

  // Use Prisma transaction to ensure atomicity - all or nothing
  const result = await prisma.$transaction(async (tx) => {
    // 1. Delete all transactions for this user
    const deletedTransactions = await tx.transaction.deleteMany({
      where: { userId },
    });

    // 2. Delete all budgets for this user
    const deletedBudgets = await tx.budget.deleteMany({
      where: { userId },
    });

    // 3. Delete all categories for this user
    const deletedCategories = await tx.category.deleteMany({
      where: { userId },
    });

    // 4. Reset user balances to 0
    await tx.user.update({
      where: { id: userId },
      data: {
        cashBalance: 0,
        bankBalance: 0,
        digitalBalance: 0,
      },
    });

    return {
      deletedTransactions: deletedTransactions.count,
      deletedBudgets: deletedBudgets.count,
      deletedCategories: deletedCategories.count,
    };
  });

  console.log('User data cleared successfully:', result);

  sendSuccess(res, result, 'All data cleared successfully');
});

export const exportUserData = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Export user data request for user:', userId);

  // Fetch user profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      currency: true,
      cashBalance: true,
      bankBalance: true,
      digitalBalance: true,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Fetch all transactions with basic category info
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    select: {
      id: true,
      amount: true,
      accountType: true,
      name: true,
      description: true,
      date: true,
      createdAt: true,
      category: {
        select: {
          name: true,
          type: true,
          icon: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  });

  // Format transactions for export
  const formattedTransactions = transactions.map((txn) => ({
    id: txn.id,
    amount: txn.amount,
    type: txn.category.type.toLowerCase(),
    category: txn.category.name,
    categoryIcon: txn.category.icon,
    accountType: txn.accountType,
    name: txn.name,
    description: txn.description,
    date: txn.date.toISOString(),
    createdAt: txn.createdAt.toISOString(),
  }));

  const exportData = {
    exportedAt: new Date().toISOString(),
    profile: {
      name: user.name,
      email: user.email,
      currency: user.currency,
    },
    balances: {
      cash: user.cashBalance,
      bank: user.bankBalance,
      digital: user.digitalBalance,
      total: user.cashBalance + user.bankBalance + user.digitalBalance,
    },
    transactions: formattedTransactions,
    summary: {
      totalTransactions: transactions.length,
      totalExpenses: formattedTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
      totalRevenue: formattedTransactions
        .filter((t) => t.type === 'revenue')
        .reduce((sum, t) => sum + t.amount, 0),
    },
  };

  console.log('User data exported successfully');

  sendSuccess(res, exportData, 'Data exported successfully');
});
