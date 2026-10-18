import { AppError } from '../errors/index.js';
import { ERROR_MESSAGES } from '../errors/errorDictionary.js';
import env from '../config/env.config.js';
import logger from '../config/logger.config.js';

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // Errores controlados: los logueo como warning (no son fallas del server)
  if (err instanceof AppError) {
    logger.warning(`${req.method} ${req.originalUrl} - ${err.code}: ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Errores inesperados: sí son problema del server
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);

  const message =
    env.nodeEnv === 'development' ? err.message : ERROR_MESSAGES.INTERNAL_ERROR;

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message,
    },
  });
};