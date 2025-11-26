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
      initialBalance: true,
      currentBalance: true,
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
      initialBalance: true,
      currentBalance: true,
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
      initialBalance: validatedData.initialBalance,
      currentBalance: validatedData.currentBalance,
      ...(validatedData.currency && { currency: validatedData.currency }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      currency: true,
      initialBalance: true,
      currentBalance: true,
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
