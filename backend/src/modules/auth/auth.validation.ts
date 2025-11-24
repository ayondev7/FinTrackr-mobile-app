import { z } from 'zod';

export const googleAuthSchema = z.object({
  sub: z.string().min(1, 'Provider ID is required'),
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').optional(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  picture: z.string().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
