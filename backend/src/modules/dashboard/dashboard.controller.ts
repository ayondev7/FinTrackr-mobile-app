import { Response } from 'express';
import prisma from '../../config/database';
import { asyncHandler, sendSuccess } from '../../utils/apiHelpers';
import { AuthRequest } from '../../middleware/auth';

export const getDashboardSummary = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Get dashboard summary for user:', userId);

  // Get user data with current balance
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      currency: true,
      cashBalance: true,
      bankBalance: true,
      digitalBalance: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Get current month's date range
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Get previous month's date range for comparison
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  // Get current month stats
  const [currentMonthExpense, currentMonthRevenue, prevMonthExpense, prevMonthRevenue] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        userId,
        type: 'expense',
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        type: 'revenue',
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        type: 'expense',
        date: {
          gte: startOfPrevMonth,
          lte: endOfPrevMonth,
        },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        type: 'revenue',
        date: {
          gte: startOfPrevMonth,
          lte: endOfPrevMonth,
        },
      },
      _sum: { amount: true },
    }),
  ]);

  const totalExpense = currentMonthExpense._sum.amount || 0;
  const totalRevenue = currentMonthRevenue._sum.amount || 0;
  const prevTotalExpense = prevMonthExpense._sum.amount || 0;
  const prevTotalRevenue = prevMonthRevenue._sum.amount || 0;

  // Calculate balance change percentage
  const prevNetIncome = prevTotalRevenue - prevTotalExpense;
  const currentNetIncome = totalRevenue - totalExpense;
  let balanceChangePercent = 0;
  if (prevNetIncome !== 0) {
    balanceChangePercent = ((currentNetIncome - prevNetIncome) / Math.abs(prevNetIncome)) * 100;
  }

  // Get recent transactions
  const recentTransactions = await prisma.transaction.findMany({
    where: { userId },
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
    orderBy: { date: 'desc' },
    take: 5,
  });

  // Format transactions for frontend
  const formattedTransactions = recentTransactions.map((txn) => ({
    id: txn.id,
    type: txn.type,
    amount: txn.amount,
    category: txn.category?.name || 'Uncategorized',
    categoryId: txn.categoryId,
    categoryIcon: txn.category?.icon,
    categoryColor: txn.category?.color,
    name: txn.name,
    description: txn.description,
    date: txn.date.toISOString(),
    createdAt: txn.createdAt.toISOString(),
    isRecurring: txn.isRecurring,
    recurringFrequency: txn.recurringFrequency,
  }));

  const dashboardData = {
    user: {
      id: user.id,
      name: user.name,
      currency: user.currency,
      cashBalance: user.cashBalance,
      bankBalance: user.bankBalance,
      digitalBalance: user.digitalBalance,
    },
    monthlyStats: {
      totalExpense,
      totalRevenue,
      netIncome: totalRevenue - totalExpense,
      prevMonthExpense: prevTotalExpense,
      prevMonthRevenue: prevTotalRevenue,
      balanceChangePercent: Math.round(balanceChangePercent * 10) / 10,
    },
    recentTransactions: formattedTransactions,
  };

  console.log('Dashboard summary retrieved successfully');

  sendSuccess(res, dashboardData, 'Dashboard summary retrieved successfully');
});

export const getRecentTransactions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Get recent transactions for user:', userId);

  const limit = parseInt(req.query.limit as string) || 5;

  const recentTransactions = await prisma.transaction.findMany({
    where: { userId },
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
    orderBy: { date: 'desc' },
    take: limit,
  });

  const formattedTransactions = recentTransactions.map((txn) => ({
    id: txn.id,
    type: txn.type,
    amount: txn.amount,
    category: txn.category?.name || 'Uncategorized',
    categoryId: txn.categoryId,
    categoryIcon: txn.category?.icon,
    categoryColor: txn.category?.color,
    name: txn.name,
    description: txn.description,
    date: txn.date.toISOString(),
    createdAt: txn.createdAt.toISOString(),
    isRecurring: txn.isRecurring,
    recurringFrequency: txn.recurringFrequency,
  }));

  console.log('Recent transactions retrieved:', formattedTransactions.length);

  sendSuccess(res, formattedTransactions, 'Recent transactions retrieved successfully');
});

export const getMonthlyStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Get monthly stats for user:', userId);

  const { month, year } = req.query;
  const now = new Date();
  const targetMonth = month ? parseInt(month as string) - 1 : now.getMonth();
  const targetYear = year ? parseInt(year as string) : now.getFullYear();

  const startOfMonth = new Date(targetYear, targetMonth, 1);
  const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

  const [expenseTotal, revenueTotal] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        userId,
        type: 'expense',
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        type: 'revenue',
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const stats = {
    month: targetMonth + 1,
    year: targetYear,
    totalExpense: expenseTotal._sum.amount || 0,
    totalRevenue: revenueTotal._sum.amount || 0,
    netIncome: (revenueTotal._sum.amount || 0) - (expenseTotal._sum.amount || 0),
    expenseCount: expenseTotal._count,
    revenueCount: revenueTotal._count,
  };

  console.log('Monthly stats retrieved successfully');

  sendSuccess(res, stats, 'Monthly stats retrieved successfully');
});
