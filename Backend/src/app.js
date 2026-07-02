import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerConfig } from './config/swagger.js';
import authRoutes from './routes/auth-routes.js';
import categoryRoutes from './routes/category-routes.js';
import productRoutes from './routes/product-routes.js';
import turnRoutes from './routes/turn-routes.js';
import saleRoutes from './routes/sale-routes.js';
import returnRoutes from './routes/return-routes.js';
import inventoryRoutes from './routes/inventory-routes.js';
import cashCloseRoutes from './routes/cash-close-routes.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Punto de Venta - Documentación'
}));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categorias', categoryRoutes);
app.use('/api/v1/productos', productRoutes);
app.use('/api/v1/turnos', turnRoutes);
app.use('/api/v1/ventas', saleRoutes);
app.use('/api/v1/devoluciones', returnRoutes);
app.use('/api/v1/inventario', inventoryRoutes);
app.use('/api/v1/cortes', cashCloseRoutes);

app.use(errorHandler);

export default app;
