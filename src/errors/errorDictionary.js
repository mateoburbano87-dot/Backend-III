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

  // Agrego al objeto ERROR_MESSAGES existente:
  FILE_REQUIRED: 'El archivo es obligatorio',
  FILE_TOO_LARGE: 'El archivo supera el tamaño máximo permitido (5 MB)',
  FILE_TYPE_INVALID: 'Tipo de archivo no permitido. Solo PDF, JPG o PNG.',
  DOCUMENT_TYPE_INVALID: 'Tipo de documento inválido',
  FILE_SAVE_ERROR: 'Error al guardar el archivo en el servidor',
  USER_NOT_FOUND: 'Usuario no encontrado', // ya existe, por si acaso
});