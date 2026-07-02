import express from 'express';
import { authController } from '../controllers/auth-controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);

export default router;
