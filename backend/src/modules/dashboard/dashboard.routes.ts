import { Router } from 'express';
import {
  getDashboardSummary,
  getRecentTransactions,
  getMonthlyStats,
} from './dashboard.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/summary', getDashboardSummary);
router.get('/recent-transactions', getRecentTransactions);
router.get('/monthly-stats', getMonthlyStats);

export default router;
