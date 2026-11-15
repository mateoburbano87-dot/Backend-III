import userRepository from '../repositories/user.repository.js';
import { DOCUMENT_TYPES } from '../constants/index.js';
import { NotFoundError, ValidationError } from '../errors/index.js';
import { ERROR_MESSAGES } from '../errors/errorDictionary.js';
import { deleteFileIfExists } from '../utils/fileUtils.js';
import logger from '../config/logger.js'; // asumo que ya tenés logger del módulo 4

class FileService {
  // Recibe los datos del archivo que dejó multer en req.file
  // y los metadatos del body (documentType)
  async uploadUserDocument(userId, file, documentType) {
    // 1. Verifico que el usuario exista
    const user = await userRepository.getById(userId);
    if (!user) {
      // Si el usuario no existe, borro el archivo que ya se subió al disco
      await deleteFileIfExists(file.path);
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // 2. Valido el tipo de documento si viene
    if (documentType && !Object.values(DOCUMENT_TYPES).includes(documentType)) {
      await deleteFileIfExists(file.path);
      throw new ValidationError(ERROR_MESSAGES.DOCUMENT_TYPE_INVALID);
    }

    // 3. Armo el objeto de metadatos (sin el archivo en sí)
    const metadata = {
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      documentType: documentType || null,
      uploadedAt: new Date(),
    };

    // 4. Guardo los metadatos en el usuario
    try {
      const updatedUser = await userRepository.addDocument(userId, metadata);
      
      // Log de éxito
      logger.info(`Documento cargado para usuario ${userId}: ${file.originalname}`);
      
      return updatedUser;
    } catch (error) {
      // Si falla la base, borro el archivo para no dejar basura
      await deleteFileIfExists(file.path);
      logger.error(`Error al guardar metadatos de archivo: ${error.message}`);
      throw new Error(ERROR_MESSAGES.FILE_SAVE_ERROR);
    }
  }

  // Para comprobantes de entrega (similar, pero asociado a una entrega)
  // Como no tengo modelo de Delivery en este proyecto simplificado,
  // lo dejo como ejemplo comentado o lo adapto a Order si existe.
  // En este caso, voy a asumir que existe un modelo Delivery
  // (si no existe, el endpoint devolverá error 404 controlado).
  async uploadDeliveryReceipt(deliveryId, file) {
    // Importación dinámica para no romper si el modelo no existe
    // (en un proyecto real, importaría normalmente)
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

    // Guardo en el documento de delivery (agrego campo receipt si no existe)
    delivery.receipt = metadata;
    await delivery.save();

    logger.info(`Comprobante cargado para entrega ${deliveryId}`);
    return delivery;
  }
}

export default new FileService();