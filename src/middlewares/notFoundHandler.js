import { ERROR_MESSAGES } from '../errors/errorDictionary.js';
import logger from '../config/logger.config.js';

export const notFoundHandler = (req, res) => {
  logger.warning(`Ruta inexistente: ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: ERROR_MESSAGES.ROUTE_NOT_FOUND,
    },
  });
};