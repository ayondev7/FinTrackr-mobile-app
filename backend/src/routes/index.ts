import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import categoryRoutes from '../modules/category/category.routes';
import transactionRoutes from '../modules/transaction/transaction.routes';
import budgetRoutes from '../modules/budget/budget.routes';
import analyticsRoutes from '../modules/analytics/analytics.routes';
import predictionsRoutes from '../modules/predictions/predictions.routes';
import walletRoutes from '../modules/wallet/wallet.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/predictions', predictionsRoutes);
router.use('/wallets', walletRoutes);

export default router;
