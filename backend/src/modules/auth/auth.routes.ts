import { Router } from 'express';
import { signup, login, socialAuth } from './auth.controller';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/social', socialAuth);

export default router;
