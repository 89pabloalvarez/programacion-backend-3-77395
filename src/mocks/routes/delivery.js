import { Router } from 'express'
import { getMockDeliveries, insertMockDeliveries } from '../controllers/delivery.js'

const router = Router()

/**
 * @swagger
 * /mocks/delivery/get:
 *   get:
 *     tags: [Mocks]
 *     summary: Obtener entregas mock
 *     parameters:
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *         description: Cantidad de entregas a generar (opcional)
 *     responses:
 *       200:
 *         description: Lista de entregas mock
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/get', getMockDeliveries)

/**
 * @swagger
 * /mocks/delivery/insert:
 *   post:
 *     tags: [Mocks]
 *     summary: Insertar entregas mock en la base de datos
 *     parameters:
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *         description: Cantidad de entregas a generar e insertar
 *     responses:
 *       200:
 *         description: Inserción completada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/insert', insertMockDeliveries)

export default router