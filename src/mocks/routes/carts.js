import { Router } from 'express'
import { getMockCarts, insertMockCarts } from '../controllers/carts.js'

const router = Router()

/**
 * @swagger
 * /mocks/carts/get:
 *   get:
 *     tags: [Mocks]
 *     summary: Obtener carritos (pedidos) mock
 *     parameters:
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *         description: Cantidad de carritos a generar (opcional)
 *     responses:
 *       200:
 *         description: Lista de carritos mock
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/get', getMockCarts)

/**
 * @swagger
 * /mocks/carts/insert:
 *   post:
 *     tags: [Mocks]
 *     summary: Insertar carritos mock en la base de datos
 *     parameters:
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *         description: Cantidad de carritos a generar e insertar
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
router.post('/insert', insertMockCarts)

export default router