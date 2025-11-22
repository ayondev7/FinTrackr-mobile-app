import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  currency: z.string().optional().default('USD'),
  initialBalance: z.number().optional().default(0),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const socialAuthSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  providerId: z.string().min(1, 'Provider ID is required'),
  image: z.string().optional(),
  currency: z.string().optional().default('USD'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SocialAuthInput = z.infer<typeof socialAuthSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
