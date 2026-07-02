import express from 'express';
import { saleController } from '../controllers/sale-controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, saleController.createReturn);

export default router;
