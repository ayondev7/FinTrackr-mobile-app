import { Response } from 'express';
import prisma from '../../config/database';
import { ApiError, asyncHandler, sendSuccess } from '../../utils/apiHelpers';
import { AuthRequest } from '../../middleware/auth';
import { createCategorySchema, updateCategorySchema } from './category.validation';

export const getCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Get categories request for user:', userId);

  const { type } = req.query;

  const categories = await prisma.category.findMany({
    where: {
      userId,
      ...(type && { type: type as string }),
    },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
    orderBy: [
      { isPinned: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  console.log('Categories retrieved successfully:', categories.length);

  sendSuccess(res, categories, 'Categories retrieved successfully');
});

export const getCategoryById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Get category by ID:', req.params.id);

  const category = await prisma.category.findFirst({
    where: {
      id: req.params.id,
      userId,
    },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  console.log('Category retrieved successfully');

  sendSuccess(res, category, 'Category retrieved successfully');
});

export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Create category request for user:', userId);

  const validatedData = createCategorySchema.parse(req.body);

  const category = await prisma.category.create({
    data: {
      ...validatedData,
      userId,
    },
  });

  console.log('Category created successfully:', category.id);

  sendSuccess(res, category, 'Category created successfully', 201);
});

export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  console.log('Update category request:', req.params.id);

  const validatedData = updateCategorySchema.parse(req.body);

  const existingCategory = await prisma.category.findFirst({
    where: {
      id: req.params.id,
      userId,
    },
  });

  if (!existingCategory) {
    throw new ApiError(404, 'Category not found');
  }

  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: validatedData,
  });

  console.log('Category updated successfully');

  sendSuccess(res, category, 'Category updated successfully');
});

export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user!;
  const categoryId = req.params.id;
  console.log('Delete category request:', categoryId);

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
    },
    include: {
      _count: {
        select: { transactions: true, budgets: true },
      },
    },
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  await prisma.$transaction(async (tx) => {
    const transactions = await tx.transaction.findMany({
      where: { categoryId, userId },
      include: {
        category: {
          select: { type: true },
        },
      },
    });

    for (const txn of transactions) {
      const amountChange = txn.category.type === 'EXPENSE' ? txn.amount : -txn.amount;
      const balanceField = txn.accountType === 'CASH' ? 'cashBalance' :
                           txn.accountType === 'BANK' ? 'bankBalance' :
                           'digitalBalance';

      await tx.user.update({
        where: { id: userId },
        data: {
          [balanceField]: {
            increment: amountChange,
          },
        },
      });
    }

    await tx.transaction.deleteMany({
      where: { categoryId, userId },
    });

    await tx.budget.deleteMany({
      where: { categoryId, userId },
    });

    await tx.category.delete({
      where: { id: categoryId },
    });
  });

  console.log('Category and related data deleted successfully');

  sendSuccess(res, {
    deletedTransactions: category._count.transactions,
    deletedBudgets: category._count.budgets,
  }, 'Category deleted successfully');
});
