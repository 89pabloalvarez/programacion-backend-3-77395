import app from './config/app.js'
import mongoConnection from './config/mongo.js'
import { Server } from 'socket.io'
import { CONSTANTS as CONST } from './common/constants.js'
import { startupServer } from './common/functions.js'
import apiRouter from './routes/index.js'
import viewsRouter from './views/views-router.js'
import registerProductSockets from './sockets/registerProductSockets.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { ERROR_DICTIONARY } from './common/errors.js'
import logger from './config/logger.js'

const startServer = async () => {
  logger.info('Inicializando ShipNow API')
  await mongoConnection()

  app.use(CONST.DIR_URL_ROOT, apiRouter)
  app.use('/', viewsRouter)
  app.use((req, res, next) => {
    const err = new Error(ERROR_DICTIONARY.ROUTE_NOT_FOUND.message)
    err.statusCode = ERROR_DICTIONARY.ROUTE_NOT_FOUND.statusCode
    err.code = ERROR_DICTIONARY.ROUTE_NOT_FOUND.code
    next(err)
  })
  app.use(errorHandler)

  const serverHttp = app.listen(CONST.PORT, () => {
    logger.info(`Servidor ShipNow escuchando en el puerto ${CONST.PORT}`)
    startupServer(CONST.BASEURL)
  })

  const io = new Server(serverHttp)
  registerProductSockets(io)
}

startServer()