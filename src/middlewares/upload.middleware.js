import { upload } from '../config/multer.config.js';
import { ValidationError } from '../errors/index.js';
import { ERROR_MESSAGES } from '../errors/errorDictionary.js';

export const uploadUserDocument = (req, res, next) => {
  req.uploadFolder = 'uploads/users/documents';

  const uploadSingle = upload.single('document');

  uploadSingle(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ValidationError(ERROR_MESSAGES.FILE_TOO_LARGE));
      }
      if (err.code === 'INVALID_FILE_TYPE') {
        return next(new ValidationError(ERROR_MESSAGES.FILE_TYPE_INVALID));
      }
      return next(err);
    }

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
        return next(new ValidationError(ERROR_MESSAGES.FILE_TYPE_INVALID));
      }
      return next(err);
    }

    if (!req.file) {
      return next(new ValidationError(ERROR_MESSAGES.FILE_REQUIRED));
    }

    next();
  });
};