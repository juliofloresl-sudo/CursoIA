import express from 'express';
import { turnController } from '../controllers/turn-controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, turnController.open);
router.get('/activo', authMiddleware, turnController.getActive);

export default router;
