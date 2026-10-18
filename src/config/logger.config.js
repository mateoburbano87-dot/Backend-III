import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import env from './env.config.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Formato común para consola y archivos:
// 2026-08-01 10:12:03 [info] Servidor escuchando en puerto 3000
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] ${stack || message}`;
});

// Niveles personalizados: agrego "http" entre debug e info.
// Los números importan: menor = más severo (para que error.log filtre bien).
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: 'magenta',
    error: 'red',
    warning: 'yellow',
    info: 'green',
    http: 'cyan',
    debug: 'gray',
  },
};

winston.addColors(customLevels.colors);

// Carpeta donde van a parar los archivos de log
const logsDir = path.resolve('logs');

// --- Transportes ---

// Consola: en dev muestro todo, en prod solo info para arriba
const consoleTransport = new winston.transports.Console({
  level: env.nodeEnv === 'development' ? 'debug' : 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
});

// Archivo general: todo lo que sea info o superior
const combinedFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d', // guarda 14 días y rota
  level: 'info',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
});

// Archivo de errores: solo warning, error y fatal
const errorFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
  level: 'warning',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
});

// --- Logger final ---
const logger = winston.createLogger({
  levels: customLevels.levels,
  level: env.nodeEnv === 'development' ? 'debug' : 'info',
  format: combine(
    errors({ stack: true }), // para que los errores muestren stack
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [consoleTransport, combinedFileTransport, errorFileTransport],
  exitOnError: false,
});

export default logger;