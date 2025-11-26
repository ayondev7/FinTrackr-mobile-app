import { Response } from 'express';
import prisma from '../../config/database';
import { asyncHandler, sendSuccess } from '../../utils/apiHelpers';
import { AuthRequest } from '../../middleware/auth';

export const getAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Get analytics request for user:', userId);

  const { startDate, endDate, type } = req.query;

  const where: any = {
    userId,
  };

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate as string);
    if (endDate) where.date.lte = new Date(endDate as string);
  }

  if (type && type !== 'both') {
    where.category = { type: (type as string).toUpperCase() };
  }

  const [transactions, expenseTotal, revenueTotal] = await Promise.all([
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
      orderBy: { date: 'desc' },
    }),
    prisma.transaction.aggregate({
      where: { ...where, category: { type: 'EXPENSE' } },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.transaction.aggregate({
      where: { ...where, category: { type: 'REVENUE' } },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const categoryBreakdown = transactions.reduce((acc: any[], transaction) => {
    const existing = acc.find(item => item.categoryId === transaction.categoryId);
    
    if (existing) {
      existing.amount += transaction.amount;
      existing.count += 1;
    } else {
      acc.push({
        categoryId: transaction.categoryId,
        categoryName: transaction.category.name,
        categoryIcon: transaction.category.icon,
        categoryColor: transaction.category.color,
        categoryType: transaction.category.type,
        amount: transaction.amount,
        count: 1,
      });
    }
    
    return acc;
  }, []);

  const totalAmount = (expenseTotal._sum.amount || 0) + (revenueTotal._sum.amount || 0);

  categoryBreakdown.forEach(item => {
    item.percentage = totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0;
  });

  categoryBreakdown.sort((a, b) => b.amount - a.amount);

  const stats = {
    totalExpense: expenseTotal._sum.amount || 0,
    totalRevenue: revenueTotal._sum.amount || 0,
    netIncome: (revenueTotal._sum.amount || 0) - (expenseTotal._sum.amount || 0),
    expenseCount: expenseTotal._count,
    revenueCount: revenueTotal._count,
    totalTransactions: transactions.length,
    averageExpense: expenseTotal._count > 0 ? (expenseTotal._sum.amount || 0) / expenseTotal._count : 0,
    averageRevenue: revenueTotal._count > 0 ? (revenueTotal._sum.amount || 0) / revenueTotal._count : 0,
  };

  console.log('Analytics retrieved successfully');

  sendSuccess(res, {
    stats,
    categoryBreakdown,
  }, 'Analytics retrieved successfully');
});

export const getMonthlyOverview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Get monthly overview for user:', userId);

  const { year } = req.query;
  const targetYear = year ? parseInt(year as string) : new Date().getFullYear();

  const months = [];
  
  for (let month = 0; month < 12; month++) {
    const startDate = new Date(targetYear, month, 1);
    const endDate = new Date(targetYear, month + 1, 0, 23, 59, 59);

    const [expenseTotal, revenueTotal] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId,
          category: { type: 'EXPENSE' },
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          category: { type: 'REVENUE' },
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: { amount: true },
      }),
    ]);

    const expense = expenseTotal._sum.amount || 0;
    const revenue = revenueTotal._sum.amount || 0;

    months.push({
      month: month + 1,
      monthName: startDate.toLocaleString('en-US', { month: 'long' }),
      year: targetYear,
      expense,
      revenue,
      netIncome: revenue - expense,
    });
  }

  console.log('Monthly overview retrieved successfully');

  sendSuccess(res, months, 'Monthly overview retrieved successfully');
});

export const getBalanceTrend = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Get balance trend for user:', userId);

  const { startDate, endDate, interval } = req.query;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { cashBalance: true, bankBalance: true, digitalBalance: true },
  });

  const where: any = {
    userId,
  };

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate as string);
    if (endDate) where.date.lte = new Date(endDate as string);
  }

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: 'asc' },
    select: {
      id: true,
      amount: true,
      date: true,
      category: {
        select: {
          type: true,
        },
      },
    },
  });

  const initialBalance = (user?.cashBalance || 0) + (user?.bankBalance || 0) + (user?.digitalBalance || 0);
  let runningBalance = initialBalance;
  const balanceTrend = [];

  for (const transaction of transactions) {
    const transactionType = transaction.category?.type?.toLowerCase() || 'expense';
    const change = transactionType === 'expense' ? -transaction.amount : transaction.amount;
    runningBalance += change;

    balanceTrend.push({
      date: transaction.date,
      balance: runningBalance,
      change,
      type: transactionType,
    });
  }

  console.log('Balance trend retrieved successfully');

  sendSuccess(res, balanceTrend, 'Balance trend retrieved successfully');
});

export const getCategoryStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Get category stats for user:', userId);

  const { startDate, endDate } = req.query;

  const where: any = {
    userId,
  };

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate as string);
    if (endDate) where.date.lte = new Date(endDate as string);
  }

  const categories = await prisma.category.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      icon: true,
      color: true,
      type: true,
    },
  });

  const categoryStats = await Promise.all(
    categories.map(async (category) => {
      const [transactions, total, avgAmount] = await Promise.all([
        prisma.transaction.count({
          where: {
            ...where,
            categoryId: category.id,
          },
        }),
        prisma.transaction.aggregate({
          where: {
            ...where,
            categoryId: category.id,
          },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: {
            ...where,
            categoryId: category.id,
          },
          _avg: { amount: true },
        }),
      ]);

      return {
        ...category,
        totalAmount: total._sum.amount || 0,
        transactionCount: transactions,
        averageAmount: avgAmount._avg.amount || 0,
      };
    })
  );

  const filteredStats = categoryStats
    .filter(stat => stat.transactionCount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount);

  console.log('Category stats retrieved successfully');

  sendSuccess(res, filteredStats, 'Category stats retrieved successfully');
});
