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
 *         $ref: '#/components/responses/ServerError'
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
 *         $ref: '#/components/responses/BadIdError'
 *       404:
 *         $ref: '#/components/responses/PurchaseNotFoundError'
 */
router.get('/:id', deliveryController.getById)

/**
 * @swagger
 * /delivery:
 *   post:
 *     tags: [Deliveries]
 *     summary: Crear una nueva entrega
 *     description: Asocia un pedido (order, ID de un Cart) con un usuario repartidor (deliveryMan, ID de un User). Ambos deben existir previamente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryCreateInput'
 *     responses:
 *       201:
 *         description: Entrega creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Falta order/deliveryMan, o alguno de los dos no es un ID válido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               requestNotComplete:
 *                 summary: Falta order o deliveryMan
 *                 value: { status: 'error', code: 'REQUEST_NOT_COMPLETE', message: 'Solicitud incompleta.', details: { body: {} } }
 *               badId:
 *                 summary: order o deliveryMan no son ObjectId válidos
 *                 value: { status: 'error', code: 'BAD_ID', message: 'El ID no tiene un formato válido.', details: { providedId: 'abc123' } }
 *       404:
 *         description: El pedido (order) o el usuario repartidor (deliveryMan) no existen.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               orderNotFound:
 *                 summary: El pedido no existe
 *                 value: { status: 'error', code: 'PURCHASE_NOT_FOUND', message: 'Recurso no encontrado.', details: { searchedCart: '64f...' } }
 *               userNotFound:
 *                 summary: El repartidor no existe
 *                 value: { status: 'error', code: 'USER_NOT_FOUND', message: 'Usuario no encontrado.', details: { searchedUser: '64f...' } }
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
 *             properties:
 *               order:
 *                 type: string
 *               deliveryMan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Entrega actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadIdError'
 *       404:
 *         $ref: '#/components/responses/PurchaseNotFoundError'
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
 *       404:
 *         $ref: '#/components/responses/PurchaseNotFoundError'
 */
router.delete('/:id', deliveryController.delete)

export default router
