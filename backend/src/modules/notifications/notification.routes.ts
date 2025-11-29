import { Router } from 'express';
import { registerDevice, unregisterDevice, getDevices, removeDevice } from './notification.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/register-device', registerDevice);
router.delete('/unregister-device/:deviceId', unregisterDevice);
router.get('/devices', getDevices);
router.delete('/devices/:deviceId', removeDevice);

export default router;
