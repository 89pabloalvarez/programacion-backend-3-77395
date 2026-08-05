import { Router } from 'express'
import { getMockProducts, insertMockProducts } from '../controllers/products.js'

const router = Router()

/**
 * @swagger
 * /mocks/products/get:
 *   get:
 *     tags: [Mocks]
 *     summary: Generar productos de prueba (no se guardan en la base)
 *     parameters:
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *         description: Cantidad a generar. Entero positivo, opcional (default 10).
 *     responses:
 *       200:
 *         description: Lista de productos simulados
 *       400:
 *         $ref: '#/components/responses/MockQuantityInvalidError'
 */
router.get('/get', getMockProducts)

/**
 * @swagger
 * /mocks/products/insert:
 *   post:
 *     tags: [Mocks]
 *     summary: Generar e insertar productos de prueba en MongoDB
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
router.post('/insert', insertMockProducts)

export default router
