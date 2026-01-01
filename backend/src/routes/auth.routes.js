import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { loginRateLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginRateLimiter, login);

// 🔒 Protected route
router.get('/me', authMiddleware, getMe);

export default router;
