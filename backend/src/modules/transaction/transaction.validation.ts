import { z } from 'zod';

export const createTransactionSchema = z.object({
  // Type is optional - it's determined by the category's type
  type: z.enum(['expense', 'revenue']).optional(),
  amount: z.number().positive('Amount must be positive'),
  categoryId: z.string().uuid('Invalid category ID'),
  accountType: z.enum(['CASH', 'BANK', 'DIGITAL']),
  name: z.string().optional(),
  description: z.string().optional(),
  date: z.string().datetime().or(z.date()),
});

export const updateTransactionSchema = z.object({
  type: z.enum(['expense', 'revenue']).optional(),
  amount: z.number().positive('Amount must be positive').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  accountType: z.enum(['CASH', 'BANK', 'DIGITAL']).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  date: z.string().datetime().or(z.date()).optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
