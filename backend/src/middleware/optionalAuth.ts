import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthUser } from './auth';

export interface OptionalAuthRequest extends Request {
  user?: AuthUser;
}

export const optionalAuthMiddleware = (
  req: OptionalAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
      req.user = { id: decoded.userId };
    }

    next();
  } catch (error) {
    next();
  }
};
