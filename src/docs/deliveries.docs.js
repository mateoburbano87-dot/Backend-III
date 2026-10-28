/**
 * @openapi
 * /api/deliveries:
 *   get:
 *     tags: [Deliveries]
 *     summary: Lista todas las entregas
 *     responses:
 *       200:
 *         description: Lista de entregas con pedido y repartidor populados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Delivery' }
 *       500: { $ref: '#/components/responses/InternalError' }
 *
 * /api/deliveries/{id}:
 *   get:
 *     tags: [Deliveries]
 *     summary: Obtiene una entrega por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: 'string' }
 *     responses:
 *       200:
 *         description: Entrega encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Delivery' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFoundError' }
 */