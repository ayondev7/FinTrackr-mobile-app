import { z } from 'zod';

export const createBudgetSchema = z.object({
  categoryId: z.string().uuid('Invalid category ID'),
  limit: z.number().positive('Limit must be positive'),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
  alertThreshold: z.number().min(0).max(100).optional().default(80),
});

export const updateBudgetSchema = z.object({
  categoryId: z.string().uuid('Invalid category ID').optional(),
  limit: z.number().positive('Limit must be positive').optional(),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  startDate: z.string().datetime().or(z.date()).optional(),
  endDate: z.string().datetime().or(z.date()).optional(),
  alertThreshold: z.number().min(0).max(100).optional(),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
