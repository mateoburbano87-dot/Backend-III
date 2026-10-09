import { AppError } from '../errors/index.js';
import { ERROR_MESSAGES } from '../errors/errorDictionary.js';
import env from '../config/env.config.js';

// Middleware global: TODOS los errores terminan acá.
// Express lo reconoce como middleware de error porque tiene 4 parámetros.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // Si el error es de nuestro dominio, responde con su status y code
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Si no lo reconozco, es un error inesperado.
  // En desarrollo muestro el mensaje real, en producción uno genérico.
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