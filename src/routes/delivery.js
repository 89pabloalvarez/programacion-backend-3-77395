import { Router } from 'express'
import { deliveryController } from '../controllers/delivery.js'

const router = Router()

/**
 * @swagger
 * /delivery:
 *   get:
 *     tags: [Deliveries]
 *     summary: Obtener todas las entregas
 *     responses:
 *       200:
 *         description: Lista de entregas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 *       500:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', deliveryController.getAll)


/**
 * @swagger
 * /delivery/{id}:
 *   get:
 *     tags: [Deliveries]
 *     summary: Obtener una entrega por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entrega encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', deliveryController.getById)


/**
 * @swagger
 * /delivery:
 *   post:
 *     tags: [Deliveries]
 *     summary: Crear una nueva entrega
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       201:
 *         description: Entrega creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', deliveryController.create)


/**
 * @swagger
 * /delivery/{id}:
 *   put:
 *     tags: [Deliveries]
 *     summary: Actualizar una entrega
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
 *         description: Entrega actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', deliveryController.update)


/**
 * @swagger
 * /delivery/{id}:
 *   delete:
 *     tags: [Deliveries]
 *     summary: Eliminar una entrega
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entrega eliminada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', deliveryController.delete)

export default router
