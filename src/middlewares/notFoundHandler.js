import { ERROR_MESSAGES } from '../errors/errorDictionary.js';

// Si ninguna ruta matcheó, cae acá antes del errorHandler
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: ERROR_MESSAGES.ROUTE_NOT_FOUND,
    },
  });
};