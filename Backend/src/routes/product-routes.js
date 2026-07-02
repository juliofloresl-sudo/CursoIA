import express from 'express';
import { productController } from '../controllers/product-controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = express.Router();

const productSchema = z.object({
  nombre: z.string().min(1),
  sku: z.string().min(1),
  id_categoria: z.coerce.number(),
  precio_venta: z.coerce.number().positive(),
  precio_costo: z.coerce.number().nonnegative(),
  descripcion: z.string().optional(),
  stock_minimo: z.coerce.number().nonnegative().optional()
});

router.get('/', productController.list);
router.post('/totales', productController.calculateTotals);
router.get('/:id', productController.getById);
router.post('/', authMiddleware, requireRole('administrador'), validate(productSchema), productController.create);
router.patch('/:id/precio', authMiddleware, requireRole('administrador'), productController.updatePrice);
router.patch('/:id/desactivar', authMiddleware, requireRole('administrador'), productController.deactivate);

export default router;
