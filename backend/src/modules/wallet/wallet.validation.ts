import { z } from 'zod';

export const createWalletSchema = z.object({
  name: z.string().min(1, 'Wallet name is required'),
  type: z.enum(['cash', 'bank', 'digital']),
  balance: z.number().optional().default(0),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().min(1, 'Color is required'),
});

export const updateWalletSchema = z.object({
  name: z.string().min(1, 'Wallet name is required').optional(),
  type: z.enum(['cash', 'bank', 'digital']).optional(),
  balance: z.number().optional(),
  icon: z.string().min(1, 'Icon is required').optional(),
  color: z.string().min(1, 'Color is required').optional(),
});

export type CreateWalletInput = z.infer<typeof createWalletSchema>;
export type UpdateWalletInput = z.infer<typeof updateWalletSchema>;
