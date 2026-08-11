import { Router } from 'express'
import { getMockDeliveries, insertMockDeliveries } from '../controllers/delivery.js'

const router = Router()

/**
 * @swagger
 * /mocks/delivery/get:
 *   get:
 *     tags: [Mocks]
 *     summary: Generar entregas de prueba (no se guardan en la base)
 *     parameters:
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *         description: Cantidad a generar. Entero positivo, opcional (default 10).
 *     responses:
 *       200:
 *         description: Lista de entregas simuladas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 *       400:
 *         $ref: '#/components/responses/MockQuantityInvalidError'
 */
router.get('/get', getMockDeliveries)

/**
 * @swagger
 * /mocks/delivery/insert:
 *   post:
 *     tags: [Mocks]
 *     summary: Generar e insertar entregas de prueba en MongoDB
 *     parameters:
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *         description: Cantidad a generar e insertar. Entero positivo, opcional (default 10).
 *     responses:
 *       200:
 *         description: Inserción completada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/MockQuantityInvalidError'
 *       500:
 *         $ref: '#/components/responses/MockInsertFailedError'
 */
router.post('/insert', insertMockDeliveries)

export default router
