import { Router } from 'express';
import { getPredictions, getSpendingInsights } from './predictions.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getPredictions);
router.get('/insights', getSpendingInsights);

export default router;
