import dotenv from 'dotenv';

dotenv.config();

// Lista de variables que la app necesita sí o sí para arrancar
const REQUIRED_VARS = ['PORT', 'MONGODB_URI', 'NODE_ENV'];

// Me fijo que ninguna falte antes de exportar nada
const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Faltan variables de entorno obligatorias: ${missing.join(', ')}. Revisá tu archivo .env`
  );
}

// Exporto un objeto ya validado para no andar leyendo process.env en todos lados
const env = {
  port: Number(process.env.PORT),
  mongoUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
};

export default env;