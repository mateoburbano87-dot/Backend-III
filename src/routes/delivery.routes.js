import { Router } from 'express';
import deliveryController from '../controllers/delivery.controller.js';

const router = Router();

router.get('/', deliveryController.getAll);
router.get('/:id', deliveryController.getById);

export default router;