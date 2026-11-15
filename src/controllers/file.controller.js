import fileService from '../services/file.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class FileController {
  // POST /api/files/users/:userId/document
  uploadUserDocument = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { documentType } = req.body;
    const file = req.file; // multer ya lo dejó acá

    const updatedUser = await fileService.uploadUserDocument(
      userId,
      file,
      documentType
    );

    res.status(201).json({
      success: true,
      message: 'Documento cargado correctamente',
      data: {
        user: updatedUser,
      },
    });
  });

  // POST /api/files/deliveries/:deliveryId/receipt
  uploadDeliveryReceipt = asyncHandler(async (req, res) => {
    const { deliveryId } = req.params;
    const file = req.file;

    const updatedDelivery = await fileService.uploadDeliveryReceipt(
      deliveryId,
      file
    );

    res.status(201).json({
      success: true,
      message: 'Comprobante cargado correctamente',
      data: {
        delivery: updatedDelivery,
      },
    });
  });
}

export default new FileController();