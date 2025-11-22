import { Response } from 'express';
import prisma from '../../config/database';
import { ApiError, asyncHandler, sendSuccess } from '../../utils/apiHelpers';
import { AuthRequest } from '../../middleware/auth';
import { createWalletSchema, updateWalletSchema } from './wallet.validation';

export const getWallets = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log('Get wallets request for user:', req.userId);

  const wallets = await prisma.wallet.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });

  console.log('Wallets retrieved successfully:', wallets.length);

  sendSuccess(res, wallets, 'Wallets retrieved successfully');
});

export const getWalletById = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log('Get wallet by ID:', req.params.id);

  const wallet = await prisma.wallet.findFirst({
    where: {
      id: req.params.id,
      userId: req.userId,
    },
  });

  if (!wallet) {
    throw new ApiError(404, 'Wallet not found');
  }

  console.log('Wallet retrieved successfully');

  sendSuccess(res, wallet, 'Wallet retrieved successfully');
});

export const createWallet = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log('Create wallet request for user:', req.userId);

  const validatedData = createWalletSchema.parse(req.body);

  const wallet = await prisma.wallet.create({
    data: {
      ...validatedData,
      userId: req.userId!,
    },
  });

  console.log('Wallet created successfully:', wallet.id);

  sendSuccess(res, wallet, 'Wallet created successfully', 201);
});

export const updateWallet = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log('Update wallet request:', req.params.id);

  const validatedData = updateWalletSchema.parse(req.body);

  const existingWallet = await prisma.wallet.findFirst({
    where: {
      id: req.params.id,
      userId: req.userId,
    },
  });

  if (!existingWallet) {
    throw new ApiError(404, 'Wallet not found');
  }

  const wallet = await prisma.wallet.update({
    where: { id: req.params.id },
    data: validatedData,
  });

  console.log('Wallet updated successfully');

  sendSuccess(res, wallet, 'Wallet updated successfully');
});

export const deleteWallet = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log('Delete wallet request:', req.params.id);

  const wallet = await prisma.wallet.findFirst({
    where: {
      id: req.params.id,
      userId: req.userId,
    },
  });

  if (!wallet) {
    throw new ApiError(404, 'Wallet not found');
  }

  await prisma.wallet.delete({
    where: { id: req.params.id },
  });

  console.log('Wallet deleted successfully');

  sendSuccess(res, null, 'Wallet deleted successfully');
});
