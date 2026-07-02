import express from 'express';
import { inventoryController } from '../controllers/inventory-controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/entradas', authMiddleware, requireRole('administrador', 'encargado_inventario'), inventoryController.createMovement);
router.post('/ajustes', authMiddleware, requireRole('administrador', 'encargado_inventario'), inventoryController.createAdjustment);
router.get('/stock-bajo', authMiddleware, requireRole('administrador', 'supervisor'), inventoryController.lowStock);

export default router;
