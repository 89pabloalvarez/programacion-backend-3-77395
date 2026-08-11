import { Router } from 'express'
import { getMockCarts, insertMockCarts } from '../controllers/carts.js'

const router = Router()

/**
 * @swagger
 * /mocks/carts/get:
 *   get:
 *     tags: [Mocks]
 *     summary: Generar pedidos (carritos) de prueba (no se guardan en la base)
 *     description: Requiere que existan productos cargados en la base, ya que cada pedido mock se arma con productos reales.
 *     parameters:
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *         description: Cantidad a generar. Entero positivo, opcional (default 10).
 *     responses:
 *       200:
 *         description: Lista de pedidos simulados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         $ref: '#/components/responses/MockQuantityInvalidError'
 *       500:
 *         $ref: '#/components/responses/MocksNoProductsError'
 */
router.get('/get', getMockCarts)

/**
 * @swagger
 * /mocks/carts/insert:
 *   post:
 *     tags: [Mocks]
 *     summary: Generar e insertar pedidos (carritos) de prueba en MongoDB
 *     description: Requiere que existan productos cargados en la base, ya que cada pedido mock se arma con productos reales.
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
 *         description: No hay productos disponibles, o falló la inserción en MongoDB.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noProducts:
 *                 summary: No hay productos cargados
 *                 value: { status: 'error', code: 'MOCKS_NO_PRODUCTS', message: 'No hay productos disponibles para generar carritos mock.', details: null }
 *               insertFailed:
 *                 summary: Falló la inserción en Mongo
 *                 value: { status: 'error', code: 'MOCK_INSERT_FAILED', message: 'Ocurrió un error al insertar los datos de prueba en MongoDB.', details: { originalError: '...' } }
 */
router.post('/insert', insertMockCarts)

export default router
