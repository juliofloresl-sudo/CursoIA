import express from 'express';
import { saleController } from '../controllers/sale-controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, saleController.create);
router.post('/:id/descuento', authMiddleware, saleController.applyDiscount);
router.get('/:id/ticket', saleController.getTicket);

export default router;
