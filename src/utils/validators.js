import { ValidationError } from '../errors/index.js';

// Valido que el body tenga los campos requeridos y que no vengan vacíos.
// Es simple a propósito: no uso librerías externas para mantenerlo legible.
export const requireFields = (body, fields) => {
  const missing = fields.filter(
    (field) => body[field] === undefined || body[field] === null || body[field] === ''
  );

  if (missing.length > 0) {
    throw new ValidationError(`Campos obligatorios faltantes: ${missing.join(', ')}`);
  }
};

// Valido que un id de Mongo tenga el formato correcto (24 hex chars).
// Lo uso antes de tocar la base para dar un error 400 en vez de un 500 feo.
export const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

export const validateObjectId = (id) => {
  if (!isValidObjectId(id)) {
    throw new ValidationError(`Id inválido: ${id}`);
  }
};