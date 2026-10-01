import express from 'express';
import productRoutes from './routes/product.routes.js';
import userRoutes from './routes/user.routes.js';
import mockRoutes from './routes/mock.routes.js';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mocks', mockRoutes);

export default app;