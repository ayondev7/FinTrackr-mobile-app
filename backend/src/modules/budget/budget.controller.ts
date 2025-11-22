import { Response } from 'express';
import prisma from '../../config/database';
import { ApiError, asyncHandler, sendSuccess } from '../../utils/apiHelpers';
import { AuthRequest } from '../../middleware/auth';
import { createBudgetSchema, updateBudgetSchema } from './budget.validation';

export const getBudgets = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log('Get budgets request for user:', req.userId);

  const { period, categoryId } = req.query;

  const where: any = {
    userId: req.userId,
  };

  if (period) where.period = period;
  if (categoryId) where.categoryId = categoryId;

  const budgets = await prisma.budget.findMany({
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
    orderBy: { createdAt: 'desc' },
  });

  const budgetsWithAlerts = budgets.map(budget => {
    const percentage = (budget.spent / budget.limit) * 100;
    const isOverBudget = budget.spent > budget.limit;
    const needsAlert = percentage >= budget.alertThreshold;

    return {
      ...budget,
      percentage: Math.round(percentage),
      isOverBudget,
      needsAlert,
    };
  });

  console.log('Budgets retrieved successfully:', budgets.length);

  sendSuccess(res, budgetsWithAlerts, 'Budgets retrieved successfully');
});

export const getBudgetById = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log('Get budget by ID:', req.params.id);

  const budget = await prisma.budget.findFirst({
    where: {
      id: req.params.id,
      userId: req.userId,
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

  if (!budget) {
    throw new ApiError(404, 'Budget not found');
  }

  const percentage = (budget.spent / budget.limit) * 100;
  const isOverBudget = budget.spent > budget.limit;
  const needsAlert = percentage >= budget.alertThreshold;

  const budgetWithAlerts = {
    ...budget,
    percentage: Math.round(percentage),
    isOverBudget,
    needsAlert,
  };

  console.log('Budget retrieved successfully');

  sendSuccess(res, budgetWithAlerts, 'Budget retrieved successfully');
});

export const createBudget = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log('Create budget request for user:', req.userId);

  const validatedData = createBudgetSchema.parse(req.body);

  const category = await prisma.category.findFirst({
    where: {
      id: validatedData.categoryId,
      userId: req.userId,
    },
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  const existingBudget = await prisma.budget.findFirst({
    where: {
      userId: req.userId,
      categoryId: validatedData.categoryId,
      period: validatedData.period,
      startDate: {
        lte: new Date(validatedData.endDate),
      },
      endDate: {
        gte: new Date(validatedData.startDate),
      },
    },
  });

  if (existingBudget) {
    throw new ApiError(400, 'Budget already exists for this category and period');
  }

  const spent = await prisma.transaction.aggregate({
    where: {
      userId: req.userId,
      categoryId: validatedData.categoryId,
      type: 'expense',
      date: {
        gte: new Date(validatedData.startDate),
        lte: new Date(validatedData.endDate),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const budget = await prisma.budget.create({
    data: {
      ...validatedData,
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate),
      spent: spent._sum.amount || 0,
      userId: req.userId!,
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

  console.log('Budget created successfully:', budget.id);

  sendSuccess(res, budget, 'Budget created successfully', 201);
});

export const updateBudget = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log('Update budget request:', req.params.id);

  const validatedData = updateBudgetSchema.parse(req.body);

  const existingBudget = await prisma.budget.findFirst({
    where: {
      id: req.params.id,
      userId: req.userId,
    },
  });

  if (!existingBudget) {
    throw new ApiError(404, 'Budget not found');
  }

  if (validatedData.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: validatedData.categoryId,
        userId: req.userId,
      },
    });

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
  }

  const budget = await prisma.budget.update({
    where: { id: req.params.id },
    data: {
      ...validatedData,
      startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
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

  console.log('Budget updated successfully');

  sendSuccess(res, budget, 'Budget updated successfully');
});

export const deleteBudget = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log('Delete budget request:', req.params.id);

  const budget = await prisma.budget.findFirst({
    where: {
      id: req.params.id,
      userId: req.userId,
    },
  });

  if (!budget) {
    throw new ApiError(404, 'Budget not found');
  }

  await prisma.budget.delete({
    where: { id: req.params.id },
  });

  console.log('Budget deleted successfully');

  sendSuccess(res, null, 'Budget deleted successfully');
});

export const refreshBudgetSpent = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log('Refresh budget spent:', req.params.id);

  const budget = await prisma.budget.findFirst({
    where: {
      id: req.params.id,
      userId: req.userId,
    },
  });

  if (!budget) {
    throw new ApiError(404, 'Budget not found');
  }

  const spent = await prisma.transaction.aggregate({
    where: {
      userId: req.userId,
      categoryId: budget.categoryId,
      type: 'expense',
      date: {
        gte: budget.startDate,
        lte: budget.endDate,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const updatedBudget = await prisma.budget.update({
    where: { id: req.params.id },
    data: {
      spent: spent._sum.amount || 0,
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

  console.log('Budget spent refreshed successfully');

  sendSuccess(res, updatedBudget, 'Budget spent refreshed successfully');
});
