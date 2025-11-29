import { Router } from 'express';
import { cleanupDevices, sendMonthlyReports } from './admin.controller';
import { adminAuthMiddleware } from './admin.middleware';

const router = Router();

router.use(adminAuthMiddleware);

router.post('/cleanup-devices', cleanupDevices);
router.post('/send-monthly-reports', sendMonthlyReports);

export default router;
