import { z } from 'zod';

export const createTransactionSchema = z.object({
  type: z.enum(['expense', 'revenue']),
  amount: z.number().positive('Amount must be positive'),
  categoryId: z.string().uuid('Invalid category ID'),
  name: z.string().optional(),
  description: z.string().optional(),
  date: z.string().datetime().or(z.date()),
  isRecurring: z.boolean().optional().default(false),
  recurringFrequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  nextDueDate: z.string().datetime().or(z.date()).optional(),
});

export const updateTransactionSchema = z.object({
  type: z.enum(['expense', 'revenue']).optional(),
  amount: z.number().positive('Amount must be positive').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  date: z.string().datetime().or(z.date()).optional(),
  isRecurring: z.boolean().optional(),
  recurringFrequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional().nullable(),
  nextDueDate: z.string().datetime().or(z.date()).optional().nullable(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
