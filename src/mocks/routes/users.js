import { Router } from 'express'
import { getMockUsers, insertMockUsers } from '../controllers/users.js'

const router = Router()

/**
 * @swagger
 * /mocks/users/get:
 *   get:
 *     tags: [Mocks]
 *     summary: Generar usuarios de prueba (no se guardan en la base)
 *     parameters:
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *         description: Cantidad a generar. Entero positivo, opcional (default 10).
 *     responses:
 *       200:
 *         description: Lista de usuarios simulados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/MockQuantityInvalidError'
 */
router.get('/get', getMockUsers)

/**
 * @swagger
 * /mocks/users/insert:
 *   post:
 *     tags: [Mocks]
 *     summary: Generar e insertar usuarios de prueba en MongoDB
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
router.post('/insert', insertMockUsers)

export default router
