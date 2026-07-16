import { Router } from 'express'
import { cartsController } from '../controllers/carts.js'

const router = Router()

// Obtener todos los carritos.
router.get('/', cartsController.getAll)

// Obtener un carrito por ID.
router.get('/:id', cartsController.getById)

// Crea un nuevo carrito.
router.post('/', cartsController.create)

// Agregar producto al carrito.
router.put('/:cid/product/:pid', cartsController.addProduct)

// Reemplazar todos los productos del carrito con un nuevo array.
router.put('/:cid', cartsController.updateProducts)

// Actualizar solo la cantidad de un producto en el carrito.
router.put('/:cid/products/:pid', cartsController.updateQuantity)

// Eliminar un producto del carrito.
router.delete('/:cid/products/:pid', cartsController.deleteProduct)

// Vaciar todos los productos del carrito.
router.delete('/:cid', cartsController.deleteAllProducts)

export default router
