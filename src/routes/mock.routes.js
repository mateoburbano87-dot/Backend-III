import { Router } from 'express';
import mockController from '../controllers/mock.controller.js';

const router = Router();

// Endpoints que devuelven datos simulados (no guardan nada)
router.get('/users', mockController.getUsers);
router.get('/orders', mockController.getOrders);
router.get('/deliveries', mockController.getDeliveries);

// Endpoint para insertar datos reales en Mongo
router.post('/seed/:collection', mockController.seed);

export default router;