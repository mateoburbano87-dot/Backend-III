/**
 * @openapi
 * /api/mocks/users:
 *   get:
 *     tags: [Mocks]
 *     summary: Genera usuarios simulados (NO se guardan en Mongo)
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: false
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 5 }
 *         description: Cantidad de usuarios a generar (entero positivo, máximo 100)
 *     responses:
 *       200:
 *         description: Lista de usuarios simulados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Cantidad inválida (negativa, 0, no numérica o mayor a 100)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *             example:
 *               success: false
 *               error:
 *                 code: VALIDATION_ERROR
 *                 message: La cantidad debe ser un número entero mayor a 0
 *
 * /api/mocks/orders:
 *   get:
 *     tags: [Mocks]
 *     summary: Genera pedidos simulados (NO se guardan)
 *     parameters:
 *       - in: query
 *         name: qty
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 5 }
 *     responses:
 *       200:
 *         description: Lista de pedidos simulados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Order' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *
 * /api/mocks/deliveries:
 *   get:
 *     tags: [Mocks]
 *     summary: Genera entregas simuladas (NO se guardan)
 *     parameters:
 *       - in: query
 *         name: qty
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 5 }
 *     responses:
 *       200:
 *         description: Lista de entregas simuladas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Delivery' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *
 * /api/mocks/seed/{collection}:
 *   post:
 *     tags: [Mocks]
 *     summary: Inserta datos de prueba en MongoDB
 *     description: >
 *       Inserta registros de prueba. Las colecciones orders y deliveries crean
 *       automáticamente dependencias (usuarios, pedidos) si no existen.
 *     parameters:
 *       - in: path
 *         name: collection
 *         required: true
 *         schema:
 *           type: string
 *           enum: [users, orders, deliveries]
 *       - in: query
 *         name: qty
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 5 }
 *     responses:
 *       201:
 *         description: Datos insertados
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       400:
 *         description: Cantidad inválida o colección no soportada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *             examples:
 *               invalidQty:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: VALIDATION_ERROR
 *                     message: La cantidad debe ser un número entero mayor a 0
 *               invalidCollection:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: BAD_REQUEST
 *                     message: Colección no soportada para seed
 *       500: { $ref: '#/components/responses/InternalError' }
 */