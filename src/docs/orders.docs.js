/**
 * @openapi
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Lista todos los pedidos
 *     responses:
 *       200:
 *         description: Lista de pedidos con el usuario populado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Order' }
 *       500: { $ref: '#/components/responses/InternalError' }
 *   post:
 *     tags: [Orders]
 *     summary: Crea un pedido
 *     description: El usuario indicado en el body debe existir.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user]
 *             properties:
 *               user: { type: string, example: '6650a1b2c3d4e5f6a7b8c9d1' }
 *               products:
 *                 type: array
 *                 items: { $ref: '#/components/schemas/OrderItem' }
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, DELIVERED, CANCELLED]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *     responses:
 *       201:
 *         description: Pedido creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Order' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       500: { $ref: '#/components/responses/InternalError' }
 *
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Obtiene un pedido por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: 'string' }
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Order' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFoundError' }
 *   delete:
 *     tags: [Orders]
 *     summary: Elimina un pedido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: 'string' }
 *     responses:
 *       204: { description: Pedido eliminado }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFoundError' }
 *
 * /api/orders/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Actualiza el estado de un pedido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: 'string' }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: Pedido actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Order' }
 *       400:
 *         description: Estado inválido o id inválido
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       404: { $ref: '#/components/responses/NotFoundError' }
 */