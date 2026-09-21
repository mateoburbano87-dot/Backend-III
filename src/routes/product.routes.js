import { Router } from 'express';
import productController from '../controllers/product.controller.js';

const router = Router();

// Las rutas solo conectan path + método del controller
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

export default router;