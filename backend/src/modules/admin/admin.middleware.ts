import { Request, Response, NextFunction } from 'express';
import { config } from '../../config';
import { ApiError } from '../../utils/apiHelpers';

export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const adminSecret = req.headers['x-admin-secret'];

  if (!config.admin.secret) {
    throw new ApiError(500, 'Admin secret is not configured');
  }

  if (!adminSecret || adminSecret !== config.admin.secret) {
    throw new ApiError(401, 'Unauthorized');
  }

  next();
};
