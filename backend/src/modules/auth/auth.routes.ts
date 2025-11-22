import { Router } from 'express';
import { signup, login, socialAuth, refreshAccessToken } from './auth.controller';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/social', socialAuth);
router.post('/refresh', refreshAccessToken);

export default router;
