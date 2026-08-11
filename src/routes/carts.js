import { Router } from 'express'
import { cartsController } from '../controllers/carts.js'

const router = Router()

/**
 * @swagger
 * /carts:
 *   get:
 *     tags: [Orders]
 *     summary: Obtener todos los pedidos
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', cartsController.getAll)

/**
 * @swagger
 * /carts/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Obtener un pedido por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         $ref: '#/components/responses/BadIdError'
 *       404:
 *         $ref: '#/components/responses/PurchaseNotFoundError'
 */
router.get('/:id', cartsController.getById)

/**
 * @swagger
 * /carts:
 *   post:
 *     tags: [Orders]
 *     summary: Crear un nuevo pedido
 *     description: El body es un array de items { productId, quantity }. El pedido se arma con esos productos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/CartItemInput'
 *     responses:
 *       201:
 *         description: Pedido creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Body inválido, cantidad inválida o errores de validación de los items.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               notArray:
 *                 summary: El body no es un array
 *                 value: { status: 'error', code: 'PRODUCT_CREATE_MUST_BE_ARRAY', message: 'El body debe ser un array.', details: null }
 *               validation:
 *                 summary: Item con campos inválidos/faltantes
 *                 value: { status: 'error', code: 'VALIDATION_FAILED', message: 'Los datos enviados no son válidos.', details: { errors: ["Faltan campos: 'productId'."] } }
 *       404:
 *         $ref: '#/components/responses/ProductNotFoundError'
 */
router.post('/', cartsController.create)

/**
 * @swagger
 * /carts/{cid}/product/{pid}:
 *   put:
 *     tags: [Orders]
 *     summary: Agregar producto al pedido
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
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
 *               quantity:
 *                 type: number
 *             required: [quantity]
 *     responses:
 *       200:
 *         description: Producto agregado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Falta la cantidad, la cantidad es inválida, o el ID no es válido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Producto o pedido no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:cid/product/:pid', cartsController.addProduct)

/**
 * @swagger
 * /carts/{cid}:
 *   put:
 *     tags: [Orders]
 *     summary: Reemplazar todos los productos del pedido
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/CartItemInput'
 *     responses:
 *       200:
 *         description: Pedido actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Body inválido, cantidad inválida o errores de validación de los items.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Pedido o alguno de los productos no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:cid', cartsController.updateProducts)

/**
 * @swagger
 * /carts/{cid}/products/{pid}:
 *   put:
 *     tags: [Orders]
 *     summary: Actualizar la cantidad de un producto en el pedido
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
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
 *               quantity:
 *                 type: number
 *             required: [quantity]
 *     responses:
 *       200:
 *         description: Cantidad actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Falta la cantidad o es inválida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: El pedido o el producto dentro del pedido no existen.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:cid/products/:pid', cartsController.updateQuantity)

/**
 * @swagger
 * /carts/{cid}/products/{pid}:
 *   delete:
 *     tags: [Orders]
 *     summary: Eliminar un producto del pedido
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: El pedido o el producto dentro del pedido no existen.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:cid/products/:pid', cartsController.deleteProduct)

/**
 * @swagger
 * /carts/{cid}:
 *   delete:
 *     tags: [Orders]
 *     summary: Vaciar todos los productos del pedido
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido vaciado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/PurchaseNotFoundError'
 */
router.delete('/:cid', cartsController.deleteAllProducts)

export default router
