import { Router } from 'express'
import { deliveryController } from '../controllers/delivery.js'

const router = Router()

// Obtener todas las entregas.
router.get('/', deliveryController.getAll)

// Obtener una entrega por ID.
router.get('/:id', deliveryController.getById)

// Crear una nueva entrega.
router.post('/', deliveryController.create)

// Actualizar una entrega.
router.put('/:id', deliveryController.update)

// Eliminar una entrega.
router.delete('/:id', deliveryController.delete)

export default router
