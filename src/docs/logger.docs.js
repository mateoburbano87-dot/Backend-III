/**
 * @openapi
 * /api/logger-test:
 *   get:
 *     tags: [Logger]
 *     summary: Endpoint de prueba del logger (NO es funcionalidad de negocio)
 *     description: >
 *       Genera un log de cada nivel (debug, http, info, warning, error, fatal)
 *       para verificar que Winston está bien configurado. NO tiene utilidad
 *       para el dominio de ShipNow.
 *     responses:
 *       200:
 *         description: Logs generados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 levels:
 *                   type: array
 *                   items: { type: string }
 *             example:
 *               message: Logs generados en todos los niveles
 *               levels: [debug, http, info, warning, error, fatal]
 */