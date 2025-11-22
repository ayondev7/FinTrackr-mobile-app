import { Router } from 'express';
import { getProfile, updateProfile, updateBalance, deleteAccount } from './user.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/balance', updateBalance);
router.delete('/account', deleteAccount);

export default router;
