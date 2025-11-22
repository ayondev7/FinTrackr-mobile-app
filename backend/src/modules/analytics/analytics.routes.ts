import { Router } from 'express';
import {
  getAnalytics,
  getMonthlyOverview,
  getBalanceTrend,
  getCategoryStats,
} from './analytics.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getAnalytics);
router.get('/monthly', getMonthlyOverview);
router.get('/balance-trend', getBalanceTrend);
router.get('/category-stats', getCategoryStats);

export default router;
