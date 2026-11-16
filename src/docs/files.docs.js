/**
 * @swagger
 * tags:
 *   name: Files
 *   description: Carga de archivos (documentos de usuario y comprobantes de entrega)
 */

/**
 * @swagger
 * /api/files/users/{userId}/document:
 *   post:
 *     summary: Sube un documento de usuario
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Archivo PDF, JPG o PNG (máx. 5 MB)
 *               documentType:
 *                 type: string
 *                 enum: [DNI, LICENSE, PASSPORT]
 *                 description: Tipo de documento (opcional)
 *     responses:
 *       201:
 *         description: Documento cargado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Documento cargado correctamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Archivo faltante, tipo inválido, tamaño excedido o tipo de documento inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al guardar el archivo
 */

/**
 * @swagger
 * /api/files/deliveries/{deliveryId}/receipt:
 *   post:
 *     summary: Sube un comprobante de entrega
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la entrega
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - receipt
 *             properties:
 *               receipt:
 *                 type: string
 *                 format: binary
 *                 description: Archivo PDF, JPG o PNG (máx. 5 MB)
 *     responses:
 *       201:
 *         description: Comprobante cargado correctamente
 *       400:
 *         description: Archivo faltante, tipo inválido o tamaño excedido
 *       404:
 *         description: Entrega no encontrada
 *       500:
 *         description: Error al guardar el archivo
 */