import userRepository from '../repositories/user.repository.js';
import { DOCUMENT_TYPES } from '../constants/index.js';
import { NotFoundError, ValidationError } from '../errors/index.js';
import { ERROR_MESSAGES } from '../errors/errorDictionary.js';
import { deleteFileIfExists } from '../utils/fileUtils.js';
import logger from '../config/logger.config.js';

class FileService {
  async uploadUserDocument(userId, file, documentType) {
    const user = await userRepository.getById(userId);
    if (!user) {
      await deleteFileIfExists(file.path);
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (documentType && !Object.values(DOCUMENT_TYPES).includes(documentType)) {
      await deleteFileIfExists(file.path);
      throw new ValidationError(ERROR_MESSAGES.DOCUMENT_TYPE_INVALID);
    }

    // Metadatos completos garantizados
    const metadata = {
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      documentType: documentType || null,
      uploadedAt: new Date(),
    };

    try {
      const updatedUser = await userRepository.addDocument(userId, metadata);
      logger.info(`Documento cargado para usuario ${userId}: ${file.originalname}`);
      return updatedUser;
    } catch (error) {
      await deleteFileIfExists(file.path);
      logger.error(`Error al guardar metadatos de archivo: ${error.message}`);
      throw new Error(ERROR_MESSAGES.FILE_SAVE_ERROR);
    }
  }

  async uploadDeliveryReceipt(deliveryId, file) {
    const { DeliveryModel } = await import('../models/delivery.model.js');

    const delivery = await DeliveryModel.findById(deliveryId);
    if (!delivery) {
      await deleteFileIfExists(file.path);
      throw new NotFoundError('Entrega no encontrada');
    }

    const metadata = {
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      uploadedAt: new Date(),
    };

    delivery.receipt = metadata;
    await delivery.save();

    logger.info(`Comprobante cargado para entrega ${deliveryId}`);
    return delivery;
  }
}

export default new FileService();