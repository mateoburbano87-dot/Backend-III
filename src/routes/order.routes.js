import { Router } from 'express';
import orderController from '../controllers/order.controller.js';

const router = Router();

router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.post('/', orderController.create);
router.patch('/:id/status', orderController.updateStatus);
router.delete('/:id', orderController.delete);

export default router;