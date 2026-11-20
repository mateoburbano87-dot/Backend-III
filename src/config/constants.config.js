import path from 'path';

// Ruta absoluta a la carpeta de uploads, definida una sola vez
export const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Subcarpetas
export const UPLOADS_FOLDERS = {
  USER_DOCS: 'users/documents',
  DELIVERY_RECEIPTS: 'deliveries/receipts',
};