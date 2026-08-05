import { Router } from 'express'
import { getMockUsers, insertMockUsers } from '../controllers/users.js'

const router = Router()

/**
 * @swagger
 * /mocks/users/get:
 *   get:
 *     tags: [Mocks]
 *     summary: Obtener usuarios mock
 *     parameters:
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *         description: Cantidad de usuarios a generar (opcional)
 *     responses:
 *       200:
 *         description: Lista de usuarios mock
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/get', getMockUsers)

/**
 * @swagger
 * /mocks/users/insert:
 *   post:
 *     tags: [Mocks]
 *     summary: Insertar usuarios mock en la base de datos
 *     parameters:
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *         description: Cantidad de usuarios a generar e insertar
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
router.post('/insert', insertMockUsers)

export default router