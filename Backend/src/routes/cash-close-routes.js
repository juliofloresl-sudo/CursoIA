import express from 'express';
import { cashCloseController } from '../controllers/cash-close-controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, requireRole('supervisor', 'administrador'), cashCloseController.create);
router.get('/', authMiddleware, requireRole('administrador', 'supervisor'), cashCloseController.history);

export default router;
