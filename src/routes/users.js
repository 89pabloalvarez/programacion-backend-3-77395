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
 *         $ref: '#/components/responses/ServerError'
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
 *         $ref: '#/components/responses/BadIdError'
 *       404:
 *         $ref: '#/components/responses/UserNotFoundError'
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
 *             $ref: '#/components/schemas/UserCreateInput'
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Falta la contraseña, o algún campo no cumple el esquema esperado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noPassword:
 *                 summary: Falta la contraseña
 *                 value: { status: 'error', code: 'USER_CREATE_NOT_PASSWORD', message: 'Se debe ingresar una contraseña al crear un usuario.', details: null }
 *               validation:
 *                 summary: Campos inválidos/faltantes
 *                 value: { status: 'error', code: 'VALIDATION_FAILED', message: 'Los datos enviados no son válidos.', details: { errors: ["Faltan campos: 'email'."] } }
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
 *             properties:
 *               name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: ID inválido o campos que no cumplen el esquema esperado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/responses/UserNotFoundError'
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
 *       404:
 *         $ref: '#/components/responses/UserNotFoundError'
 */
router.delete('/:id', usersController.delete)

export default router
