import { Router } from 'express';
import {
  getWallets,
  getWalletById,
  createWallet,
  updateWallet,
  deleteWallet,
} from './wallet.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getWallets);
router.post('/', createWallet);
router.get('/:id', getWalletById);
router.put('/:id', updateWallet);
router.delete('/:id', deleteWallet);

export default router;
