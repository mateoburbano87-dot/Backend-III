import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec, shouldMountSwagger } from './config/swagger.config.js';
import { UPLOADS_DIR } from './config/constants.config.js';
import env from './config/env.config.js';
import productRoutes from './routes/product.routes.js';
import userRoutes from './routes/user.routes.js';
import mockRoutes from './routes/mock.routes.js';
import fileRoutes from './routes/file.routes.js';
import orderRoutes from './routes/order.routes.js';
import deliveryRoutes from './routes/delivery.routes.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(express.json());

// Servir uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// Health check (No expone info sensible)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    env: env.nodeEnv,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Swagger condicional y Mocks condicionales (solo si no es producción)
if (shouldMountSwagger()) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));
  app.use('/api/mocks', mockRoutes);
}

// Rutas principales
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/deliveries', deliveryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;