import { Router } from 'express';
import fileController from '../controllers/file.controller.js';
import {
  uploadUserDocument,
  uploadDeliveryReceipt,
} from '../middlewares/upload.middleware.js';

const router = Router();

// Documentos de usuario
router.post(
  '/users/:userId/document',
  uploadUserDocument,
  fileController.uploadUserDocument
);

// Comprobantes de entrega
router.post(
  '/deliveries/:deliveryId/receipt',
  uploadDeliveryReceipt,
  fileController.uploadDeliveryReceipt
);

export default router;