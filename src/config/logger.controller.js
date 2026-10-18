import logger from '../config/logger.config.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class LoggerController {
  // GET /api/logger-test
  // Dispara un log de cada nivel para verificar la configuración
  test = asyncHandler(async (req, res) => {
    logger.debug('Log de prueba: nivel debug');
    logger.http('Log de prueba: nivel http');
    logger.info('Log de prueba: nivel info');
    logger.warning('Log de prueba: nivel warning');
    logger.error('Log de prueba: nivel error');
    logger.fatal('Log de prueba: nivel fatal');

    res.status(200).json({
      message: 'Logs generados en todos los niveles',
      levels: ['debug', 'http', 'info', 'warning', 'error', 'fatal'],
    });
  });
}

export default new LoggerController();