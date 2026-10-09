// Envuelve un controller async para que cualquier error
// (throw o reject) se derive automáticamente al middleware.
// Es una forma prolija de no andar repitiendo try/catch en cada handler.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};