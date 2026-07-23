import { Router } from 'express'
import { CONSTANTS as CONST } from '../common/constants.js'
import productsRouter from './products.js'
import cartsRouter from './carts.js'
import usersRouter from './users.js'
import mocksUsersRouter from '../mocks/routes/users.js'
import mocksProductsRouter from '../mocks/routes/products.js'
import mocksCartsRouter from '../mocks/routes/carts.js'

const router = Router()

router.use(CONST.DIR_URL_PRODUCTS, productsRouter)
router.use(CONST.DIR_URL_CARTS, cartsRouter)
router.use(CONST.DIR_URL_USERS, usersRouter)
router.use(`${CONST.DIR_URL_MOCKS}${CONST.DIR_URL_USERS}`, mocksUsersRouter)
router.use(`${CONST.DIR_URL_MOCKS}${CONST.DIR_URL_PRODUCTS}`, mocksProductsRouter)
router.use(`${CONST.DIR_URL_MOCKS}${CONST.DIR_URL_CARTS}`, mocksCartsRouter)

export default router