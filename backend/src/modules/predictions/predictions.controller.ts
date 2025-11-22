import { Response } from 'express';
import prisma from '../../config/database';
import { asyncHandler, sendSuccess } from '../../utils/apiHelpers';
import { AuthRequest } from '../../middleware/auth';

export const getPredictions = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log('Get predictions for user:', req.userId);

  const { months } = req.query;
  const projectionMonths = months ? parseInt(months as string) : 6;

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { currentBalance: true },
  });

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [expenseData, revenueData] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        userId: req.userId,
        type: 'expense',
        date: { gte: sixMonthsAgo },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.transaction.aggregate({
      where: {
        userId: req.userId,
        type: 'revenue',
        date: { gte: sixMonthsAgo },
      },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const totalExpense = expenseData._sum.amount || 0;
  const totalRevenue = revenueData._sum.amount || 0;
  const averageMonthlyExpense = totalExpense / 6;
  const averageMonthlyRevenue = totalRevenue / 6;
  const averageMonthlyNet = averageMonthlyRevenue - averageMonthlyExpense;

  const currentBalance = user?.currentBalance || 0;

  const projectedBalances = [];
  let runningBalance = currentBalance;

  for (let i = 1; i <= projectionMonths; i++) {
    runningBalance += averageMonthlyNet;
    
    const date = new Date();
    date.setMonth(date.getMonth() + i);

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    if (runningBalance < 0) {
      status = 'critical';
    } else if (runningBalance < averageMonthlyExpense) {
      status = 'warning';
    }

    projectedBalances.push({
      month: date.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      estimatedBalance: Math.round(runningBalance * 100) / 100,
      status,
    });
  }

  const recommendations = [];

  if (averageMonthlyNet < 0) {
    recommendations.push('Your expenses exceed your revenue. Consider reducing spending or increasing income.');
  }

  if (currentBalance < averageMonthlyExpense * 3) {
    recommendations.push('Build an emergency fund covering at least 3 months of expenses.');
  }

  if (averageMonthlyExpense > averageMonthlyRevenue * 0.7) {
    recommendations.push('Your expenses are high relative to income. Aim to keep expenses below 70% of revenue.');
  }

  if (projectedBalances.some(p => p.status === 'critical')) {
    recommendations.push('Warning: Projections show potential negative balance. Review your budget urgently.');
  }

  if (averageMonthlyNet > 0 && currentBalance > averageMonthlyExpense * 6) {
    recommendations.push('Great job! Consider investing surplus funds for better returns.');
  }

  const topExpenseCategories = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: {
      userId: req.userId,
      type: 'expense',
      date: { gte: sixMonthsAgo },
    },
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
    take: 3,
  });

  if (topExpenseCategories.length > 0) {
    const categories = await prisma.category.findMany({
      where: {
        id: { in: topExpenseCategories.map(c => c.categoryId) },
      },
      select: { name: true, id: true },
    });

    const topCategory = categories.find(c => c.id === topExpenseCategories[0].categoryId);
    if (topCategory) {
      recommendations.push(`Your highest spending category is ${topCategory.name}. Look for savings opportunities here.`);
    }
  }

  const estimatedMonthsLeft = averageMonthlyNet < 0 
    ? Math.floor(currentBalance / Math.abs(averageMonthlyNet))
    : Infinity;

  console.log('Predictions generated successfully');

  sendSuccess(res, {
    currentBalance,
    averageMonthlyExpense: Math.round(averageMonthlyExpense * 100) / 100,
    averageMonthlyRevenue: Math.round(averageMonthlyRevenue * 100) / 100,
    averageMonthlyNet: Math.round(averageMonthlyNet * 100) / 100,
    estimatedMonthsLeft: estimatedMonthsLeft === Infinity ? null : estimatedMonthsLeft,
    projectedBalances,
    recommendations,
  }, 'Predictions generated successfully');
});

export const getSpendingInsights = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log('Get spending insights for user:', req.userId);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const [currentPeriod, previousPeriod] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        userId: req.userId,
        type: 'expense',
        date: { gte: thirtyDaysAgo },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.transaction.aggregate({
      where: {
        userId: req.userId,
        type: 'expense',
        date: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const currentSpending = currentPeriod._sum.amount || 0;
  const previousSpending = previousPeriod._sum.amount || 0;

  const spendingChange = previousSpending > 0 
    ? ((currentSpending - previousSpending) / previousSpending) * 100
    : 0;

  const insights = {
    currentMonthSpending: Math.round(currentSpending * 100) / 100,
    previousMonthSpending: Math.round(previousSpending * 100) / 100,
    changePercentage: Math.round(spendingChange * 100) / 100,
    trend: spendingChange > 10 ? 'increasing' : spendingChange < -10 ? 'decreasing' : 'stable',
    currentTransactionCount: currentPeriod._count,
    previousTransactionCount: previousPeriod._count,
  };

  console.log('Spending insights retrieved successfully');

  sendSuccess(res, insights, 'Spending insights retrieved successfully');
});
