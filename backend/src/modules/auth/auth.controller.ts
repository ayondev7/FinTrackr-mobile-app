import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import prisma from '../../config/database';
import { config } from '../../config';
import { ApiError, asyncHandler, sendSuccess } from '../../utils/apiHelpers';
import { googleAuthSchema, refreshTokenSchema } from './auth.validation';
import type { GoogleAuthInput } from './auth.validation';

const resolveDisplayName = (payload: GoogleAuthInput) => {
  if (payload.name && payload.name.trim()) {
    return payload.name.trim();
  }

  const combinedName = `${payload.given_name ?? ''} ${payload.family_name ?? ''}`.trim();
  if (combinedName) {
    return combinedName;
  }

  return payload.email.split('@')[0];
};

const getJwtSecret = (): Secret => {
  if (!config.jwt.secret) {
    throw new ApiError(500, 'JWT secret is not configured');
  }

  return config.jwt.secret;
};

const createToken = (userId: string, expiresIn: string | number) => {
  const normalizedExpiry = expiresIn as StringValue | number;
  const options: SignOptions = { expiresIn: normalizedExpiry };
  return jwt.sign({ userId }, getJwtSecret(), options);
};

const createTokenPair = (userId: string) => ({
  accessToken: createToken(userId, config.jwt.accessTokenExpiresIn || '30m'),
  refreshToken: createToken(userId, config.jwt.refreshTokenExpiresIn || '7d'),
});

export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  console.log('Google auth request received:', req.body?.email ?? '(no email)');
  console.log('Google auth headers:', JSON.stringify(req.headers));
  console.log('Google auth full body:', JSON.stringify(req.body));

  const validatedData = googleAuthSchema.parse(req.body);
  const normalizedName = resolveDisplayName(validatedData);

  let user = await prisma.user.findUnique({
    where: { providerId: validatedData.sub },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: validatedData.email,
        providerId: validatedData.sub,
        image: validatedData.picture,
        cashBalance: 0,
        bankBalance: 0,
        digitalBalance: 0,
      },
    });

    console.log('New Google auth user created:', user.id);
  } else {
    const shouldUpdate = user.name !== normalizedName || (!!validatedData.picture && user.image !== validatedData.picture);
    if (shouldUpdate) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: normalizedName,
          image: validatedData.picture ?? user.image,
        },
      });
    }

    console.log('Existing Google auth user logged in:', user.id);
  }

  const tokens = createTokenPair(user.id);

  sendSuccess(res, tokens, 'Authentication successful');
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  console.log('Refresh token request received');

  const validatedData = refreshTokenSchema.parse(req.body);

  const decoded = jwt.verify(validatedData.refreshToken, getJwtSecret()) as { userId: string };

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const tokens = createTokenPair(user.id);

  console.log('Access token refreshed successfully');

  sendSuccess(res, tokens, 'Token refreshed successfully');
});
