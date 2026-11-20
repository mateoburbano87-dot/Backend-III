import dotenv from 'dotenv';

dotenv.config();

const REQUIRED_VARS = ['PORT', 'MONGODB_URI', 'NODE_ENV'];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Faltan variables de entorno obligatorias: ${missing.join(', ')}. Revisá tu archivo .env`
  );
}

const env = {
  port: Number(process.env.PORT),
  mongoUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
  logLevel: process.env.LOG_LEVEL || 'info', // Nivel de log configurable
};

export default env;