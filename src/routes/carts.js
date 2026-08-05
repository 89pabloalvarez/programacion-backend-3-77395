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
 *         $ref: '#/components/schemas/ErrorResponse'
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
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', cartsController.getById)


/**
 * @swagger
 * /carts:
 *   post:
 *     tags: [Orders]
 *     summary: Crear un nuevo pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Pedido creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
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
 *     responses:
 *       200:
 *         description: Producto agregado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
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
 *               $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       200:
 *         description: Pedido actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
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
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cantidad actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
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
 */
router.delete('/:cid', cartsController.deleteAllProducts)

export default router
