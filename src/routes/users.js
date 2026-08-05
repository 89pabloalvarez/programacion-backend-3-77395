import { Router } from "express"
import { usersController } from "../controllers/users.js"

const router = Router()

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Obtener todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', usersController.getAll)


/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obtener usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', usersController.getById)


/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Crear un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', usersController.create)


/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Actualizar un usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id', usersController.update)


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Eliminar un usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', usersController.delete)

export default router