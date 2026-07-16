import { Router } from 'express'
import { CONSTANTS as CONST } from '../common/constants.js'
import productsRouter from './products.js'
import cartsRouter from './carts.js'

const router = Router()

router.use(CONST.DIR_URL_PRODUCTS, productsRouter)
router.use(CONST.DIR_URL_CARTS, cartsRouter)

export default router