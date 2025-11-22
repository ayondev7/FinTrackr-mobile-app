import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/database';
import { config } from '../../config';
import { ApiError, asyncHandler, sendSuccess } from '../../utils/apiHelpers';
import { signupSchema, loginSchema, socialAuthSchema } from './auth.validation';

export const signup = asyncHandler(async (req: Request, res: Response) => {
  console.log('Signup request received:', req.body.email);

  const validatedData = signupSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  if (existingUser) {
    throw new ApiError(400, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  const user = await prisma.user.create({
    data: {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      currency: validatedData.currency,
      initialBalance: validatedData.initialBalance,
      currentBalance: validatedData.initialBalance,
    },
  });

  console.log('User created successfully:', user.id);

  const accessToken = jwt.sign({ userId: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.accessTokenExpiresIn,
  });

  const refreshToken = jwt.sign({ userId: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.refreshTokenExpiresIn,
  });

  const { password, ...userWithoutPassword } = user;

  sendSuccess(
    res,
    {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    },
    'User registered successfully',
    201
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  console.log('Login request received:', req.body.email);

  const validatedData = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  if (!user || !user.password) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  console.log('User logged in successfully:', user.id);

  const accessToken = jwt.sign({ userId: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.accessTokenExpiresIn,
  });

  const refreshToken = jwt.sign({ userId: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.refreshTokenExpiresIn,
  });

  const { password, ...userWithoutPassword } = user;

  sendSuccess(res, {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  }, 'Login successful');
});

export const socialAuth = asyncHandler(async (req: Request, res: Response) => {
  console.log('Social auth request received:', req.body.email);

  const validatedData = socialAuthSchema.parse(req.body);

  let user = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        providerId: validatedData.providerId,
        image: validatedData.image,
        currency: validatedData.currency,
        initialBalance: 0,
        currentBalance: 0,
      },
    });

    console.log('New social user created:', user.id);
  } else {
    console.log('Existing social user logged in:', user.id);
  }

  const accessToken = jwt.sign({ userId: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.accessTokenExpiresIn,
  });

  const refreshToken = jwt.sign({ userId: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.refreshTokenExpiresIn,
  });

  const { password, ...userWithoutPassword } = user;

  sendSuccess(res, {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  }, 'Authentication successful');
});
