import { upload } from '../config/multer.config.js';
import { ValidationError } from '../errors/index.js';
import { ERROR_MESSAGES } from '../errors/errorDictionary.js';

// Middleware que decide la carpeta según el tipo de upload
// y luego llama a multer con el campo correcto.
export const uploadUserDocument = (req, res, next) => {
  // Antes de que multer procese, seteo la carpeta destino
  req.uploadFolder = 'uploads/users/documents';
  
  // Uso single porque espero un solo archivo en el campo 'document'
  const uploadSingle = upload.single('document');
  
  uploadSingle(req, res, (err) => {
    if (err) {
      // Si multer tira un error de tamaño, lo transformo
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ValidationError(ERROR_MESSAGES.FILE_TOO_LARGE));
      }
      // Si es el error de tipo que yo mismo tiré, lo paso
      if (err.code === 'INVALID_FILE_TYPE') {
        return next(new ValidationError(err.message));
      }
      return next(err);
    }
    
    // Si no vino archivo, error controlado
    if (!req.file) {
      return next(new ValidationError(ERROR_MESSAGES.FILE_REQUIRED));
    }
    
    next();
  });
};

export const uploadDeliveryReceipt = (req, res, next) => {
  req.uploadFolder = 'uploads/deliveries/receipts';
  
  const uploadSingle = upload.single('receipt');
  
  uploadSingle(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ValidationError(ERROR_MESSAGES.FILE_TOO_LARGE));
      }
      if (err.code === 'INVALID_FILE_TYPE') {
        return next(new ValidationError(err.message));
      }
      return next(err);
    }
    
    if (!req.file) {
      return next(new ValidationError(ERROR_MESSAGES.FILE_REQUIRED));
    }
    
    next();
  });
};