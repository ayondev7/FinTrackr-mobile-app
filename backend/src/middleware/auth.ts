import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from '../utils/apiHelpers';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
    req.userId = decoded.userId;

    next();
  } catch (error) {
    next(error);
  }
};
