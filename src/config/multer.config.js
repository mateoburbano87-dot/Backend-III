import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { UPLOADS_DIR, UPLOADS_FOLDERS } from './constants.config.js';

// Creo las carpetas necesarias si no existen
Object.values(UPLOADS_FOLDERS).forEach((folder) => {
  const fullPath = path.join(UPLOADS_DIR, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Usamos req.uploadFolder que seteamos en el middleware
    const folderPath = path.join(UPLOADS_DIR, req.uploadFolder);
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Tipo de archivo no permitido.');
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});