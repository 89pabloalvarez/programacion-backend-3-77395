import { Router } from 'express'
import { CONSTANTS as CONST } from '../common/constants.js'
import productsRouter from './products.js'
import cartsRouter from './carts.js'
import usersRouter from './users.js'
import deliveryRouter from './delivery.js'
import loggerRouter from './logger.js'
import { blockInProduction } from '../middlewares/restrictInProduction.js'

const router = Router()

router.use(CONST.DIR_URL_PRODUCTS, productsRouter)
router.use(CONST.DIR_URL_CARTS, cartsRouter)
router.use(CONST.DIR_URL_USERS, usersRouter)
router.use(CONST.DIR_URL_DELIVERY, deliveryRouter)

// Endpoints internos de desarrollo/testing qyue no se deben usar en producción
if (process.env.NODE_ENV !== 'production') {
  const { default: mocksUsersRouter } = await import('../mocks/routes/users.js')
  const { default: mocksProductsRouter } = await import('../mocks/routes/products.js')
  const { default: mocksCartsRouter } = await import('../mocks/routes/carts.js')
  const { default: mocksDeliveryRouter } = await import('../mocks/routes/delivery.js')

  router.use(`${CONST.DIR_URL_MOCKS}${CONST.DIR_URL_USERS}`, mocksUsersRouter)
  router.use(`${CONST.DIR_URL_MOCKS}${CONST.DIR_URL_PRODUCTS}`, mocksProductsRouter)
  router.use(`${CONST.DIR_URL_MOCKS}${CONST.DIR_URL_CARTS}`, mocksCartsRouter)
  router.use(`${CONST.DIR_URL_MOCKS}${CONST.DIR_URL_DELIVERY}`, mocksDeliveryRouter)
}
router.use('/logger', blockInProduction, loggerRouter)

export default router