import { Router } from 'express';
import { googleAuth, refreshAccessToken } from './auth.controller';

const router = Router();

router.post('/google', googleAuth);
router.post('/refresh', refreshAccessToken);

export default router;
