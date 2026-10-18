import mongoose from 'mongoose';
import app from './app.js';
import env from './config/env.config.js';
import logger from './config/logger.config.js';

const startServer = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info('Conexión a MongoDB establecida');

    app.listen(env.port, () => {
      logger.info(`Servidor ShipNow escuchando en el puerto ${env.port}`);
      logger.debug(`Entorno: ${env.nodeEnv}`);
    });
  } catch (error) {
    // Si no puedo conectar a Mongo, es una falla crítica
    logger.fatal(`Error al iniciar la app: ${error.message}`);
    process.exit(1);
  }
};

startServer();