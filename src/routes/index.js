import { Router } from 'express'
import { CONSTANTS as CONST } from '../common/constants.js'
import productsRouter from './products.js'
import cartsRouter from './carts.js'
import usersRouter from './users.js'
import deliveryRouter from './delivery.js'
import mocksUsersRouter from '../mocks/routes/users.js'
import mocksProductsRouter from '../mocks/routes/products.js'
import mocksCartsRouter from '../mocks/routes/carts.js'
import mocksDeliveryRouter from '../mocks/routes/delivery.js'
import loggerRouter from './logger.js'

const router = Router()

router.use(CONST.DIR_URL_PRODUCTS, productsRouter)
router.use(CONST.DIR_URL_CARTS, cartsRouter)
router.use(CONST.DIR_URL_USERS, usersRouter)
router.use(CONST.DIR_URL_DELIVERY, deliveryRouter)
router.use(`${CONST.DIR_URL_MOCKS}${CONST.DIR_URL_USERS}`, mocksUsersRouter)
router.use(`${CONST.DIR_URL_MOCKS}${CONST.DIR_URL_PRODUCTS}`, mocksProductsRouter)
router.use(`${CONST.DIR_URL_MOCKS}${CONST.DIR_URL_CARTS}`, mocksCartsRouter)
router.use(`${CONST.DIR_URL_MOCKS}${CONST.DIR_URL_DELIVERY}`, mocksDeliveryRouter)
router.use('/logger', loggerRouter)

export default router