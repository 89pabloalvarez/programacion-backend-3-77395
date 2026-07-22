import { Router } from 'express'
import { CONSTANTS as CONST } from '../common/constants.js'
import productsRouter from './products.js'
import cartsRouter from './carts.js'
import usersRouter from './users.js'

const router = Router()

router.use(CONST.DIR_URL_PRODUCTS, productsRouter)
router.use(CONST.DIR_URL_CARTS, cartsRouter)
router.use(CONST.DIR_URL_USERS, usersRouter)

export default router