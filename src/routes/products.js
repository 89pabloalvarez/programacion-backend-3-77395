import { Router } from "express"
import { productsController } from "../controllers/products.js"

const router = Router()

// Obtener todos los productos.
router.get('/', productsController.getAll)

// Obtener producto por ID.
router.get('/:id', productsController.getById)

// Crea un nuevo producto.
router.post('/', productsController.create)

// Actualizar un producto.
router.put('/:id', productsController.update)

// Eliminar un producto.
router.delete('/:id', productsController.delete)

export default router