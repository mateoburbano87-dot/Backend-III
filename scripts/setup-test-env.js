import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envTestPath = path.join(__dirname, '../.env.test');
const envExamplePath = path.join(__dirname, '../.env.test.example');

if (!fs.existsSync(envTestPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envTestPath);
    console.log('✅ .env.test creado a partir de .env.test.example');
  } else {
    console.warn('⚠️ No se encontró .env.test.example. Creando .env.test básico.');
    fs.writeFileSync(
      envTestPath,
      'PORT=3001\nMONGODB_URI=mongodb://localhost:27017/shipnow_test\nNODE_ENV=test\n'
    );
  }
} else {
  console.log('ℹ️ .env.test ya existe, no se modifica.');
}