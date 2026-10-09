// Clase base para todos los errores controlados de la app.
// La idea es que cualquier error "esperado" herede de acá así el
// middleware global sabe que puede responderlo sin explotar.
export class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Marca que es un error controlado
    Error.captureStackTrace(this, this.constructor);
  }
}