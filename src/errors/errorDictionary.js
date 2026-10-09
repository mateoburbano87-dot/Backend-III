// Diccionario de mensajes de error del dominio.
// Los uso desde los services para no andar escribiendo strings sueltos por todos lados.

export const ERROR_MESSAGES = Object.freeze({
  // Productos
  PRODUCT_NOT_FOUND: 'Producto no encontrado',
  PRODUCT_NAME_PRICE_REQUIRED: 'Nombre y precio son obligatorios',

  // Usuarios
  USER_NOT_FOUND: 'Usuario no encontrado',
  USER_NAME_EMAIL_REQUIRED: 'Nombre y email son obligatorios',
  USER_EMAIL_IN_USE: 'Ya existe un usuario con ese email',

  // Mocks
  MOCK_INVALID_QTY: 'La cantidad debe ser un número entero mayor a 0',
  MOCK_COLLECTION_NOT_SUPPORTED: 'Colección no soportada para seed',
  MOCK_SEED_FAILED: 'Error al insertar los datos de prueba',

  // Genéricos
  INTERNAL_ERROR: 'Error interno del servidor',
  ROUTE_NOT_FOUND: 'Ruta no encontrada',
});