import express from 'express';
import productRoutes from './routes/product.routes.js';
import userRoutes from './routes/user.routes.js';
import mockRoutes from './routes/mock.routes.js';
import loggerRoutes from './routes/logger.routes.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import logger from './config/logger.config.js';

const app = express();

app.use(express.json());

// Logueo cada request como nivel http (una línea por request, sin body)
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.originalUrl}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mocks', mockRoutes);
app.use('/api/logger-test', loggerRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;