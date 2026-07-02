import express from 'express';
import { categoryController } from '../controllers/category-controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', categoryController.list);
router.post('/', authMiddleware, requireRole('administrador'), categoryController.create);
router.patch('/:id', authMiddleware, requireRole('administrador'), categoryController.update);

export default router;
