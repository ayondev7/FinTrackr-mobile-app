import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  image: z.string().optional(),
  currency: z.string().optional(),
  theme: z.enum(['light', 'dark']).optional(),
});

export const updateBalanceSchema = z.object({
  initialBalance: z.number(),
  currentBalance: z.number(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateBalanceInput = z.infer<typeof updateBalanceSchema>;
