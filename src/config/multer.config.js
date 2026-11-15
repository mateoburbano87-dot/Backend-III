import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Como uso ES modules, necesito esto para obtener __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta raíz de uploads (fuera de src, en la raíz del proyecto)
const UPLOAD_ROOT = path.join(__dirname, '../../uploads');

// Me aseguro de que existan las subcarpetas al arrancar
const folders = ['users/documents', 'deliveries/receipts'];
folders.forEach((folder) => {
  const fullPath = path.join(UPLOAD_ROOT, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Configuración de almacenamiento en disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Según el campo o la ruta, elijo la carpeta
    // Esto lo decide el middleware antes de llamar a multer
    cb(null, req.uploadFolder || UPLOAD_ROOT);
  },
  filename: (req, file, cb) => {
    // Nombre único: timestamp + random + extensión original
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// Filtro de tipos permitidos (PDF e imágenes)
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Creo un error con code para que el middleware de errores lo reconozca
    const error = new Error('Tipo de archivo no permitido. Solo PDF, JPG o PNG.');
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

// Exporto la instancia configurada de multer
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máximo
});

// Exporto la raíz por si la necesito en otro lado
export { UPLOAD_ROOT };