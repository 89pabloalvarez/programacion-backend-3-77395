import { Router } from 'express'
import { getMockProducts, insertMockProducts } from '../controllers/products.js'

const router = Router()

/**
 * @swagger
 * /mocks/products/get:
 *   get:
 *     tags: [Mocks]
 *     summary: Obtener productos mock
 *     parameters:
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *         description: Cantidad de productos a generar (opcional)
 *     responses:
 *       200:
 *         description: Lista de productos mock
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Cantidad inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/get', getMockProducts)

/**
 * @swagger
 * /mocks/products/insert:
 *   post:
 *     tags: [Mocks]
 *     summary: Insertar productos mock en la base de datos
 *     parameters:
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *         description: Cantidad de productos a generar e insertar
 *     responses:
 *       200:
 *         description: Inserción completada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Cantidad inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al insertar mocks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/insert', insertMockProducts)

export default router