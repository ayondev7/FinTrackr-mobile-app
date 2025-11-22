import { Router } from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
} from './transaction.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getTransactions);
router.post('/', createTransaction);
router.get('/stats', getTransactionStats);
router.get('/:id', getTransactionById);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
