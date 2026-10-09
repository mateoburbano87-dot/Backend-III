import { AppError } from './AppError.js';

// Errores concretos del dominio.
// Cada uno tiene su statusCode y un code interno para identificar el caso.

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Datos inválidos') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Solicitud inválida') {
    super(message, 400, 'BAD_REQUEST');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflicto con el recurso') {
    super(message, 409, 'CONFLICT');
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Error al acceder a la base de datos') {
    super(message, 500, 'DATABASE_ERROR');
  }
}

export { AppError };