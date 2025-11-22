import { z } from 'zod';

export const analyticsQuerySchema = z.object({
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
  type: z.enum(['expense', 'revenue', 'both']).optional().default('both'),
});

export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>;
