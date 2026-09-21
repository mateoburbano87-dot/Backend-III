import mongoose from 'mongoose';
import app from './app.js';
import env from './config/env.config.js';

// Me conecto a Mongo primero y recién después levanto el server
const startServer = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('Conectado a MongoDB');

    app.listen(env.port, () => {
      console.log(`Servidor corriendo en puerto ${env.port} (${env.nodeEnv})`);
    });
  } catch (error) {
    console.error('Error al iniciar la app:', error.message);
    process.exit(1);
  }
};

startServer();