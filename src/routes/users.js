import { Router } from "express"
import { usersController } from "../controllers/users.js"

const router = Router()

// Obtener todos los usuarios.
router.get('/', usersController.getAll)

// Obtener usuario por ID.
router.get('/:id', usersController.getById)

// Crea un nuevo usuario.
router.post('/', usersController.create)

// Actualizar un usuario.
router.put('/:id', usersController.update)

// Eliminar un usuario.
router.delete('/:id', usersController.delete)

export default router