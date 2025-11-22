import { Router } from 'express';
import {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  refreshBudgetSpent,
} from './budget.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getBudgets);
router.post('/', createBudget);
router.get('/:id', getBudgetById);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);
router.post('/:id/refresh', refreshBudgetSpent);

export default router;
