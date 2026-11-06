import dotenv from 'dotenv';

// Si estamos en test, cargo el .env.test. Si no, el .env normal.
// Importante: NODE_ENV tiene que estar seteado ANTES de esta línea
// (lo hace el script "test" en package.json con NODE_ENV=test mocha ...)
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

dotenv.config({ path: envFile });

const REQUIRED_VARS = ['PORT', 'MONGODB_URI', 'NODE_ENV'];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Faltan variables de entorno obligatorias: ${missing.join(', ')}. Revisá tu archivo ${envFile}`
  );
}

const env = {
  port: Number(process.env.PORT),
  mongoUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
};

export default env;