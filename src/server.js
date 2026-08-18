import app from './config/app.js'
import mongoConnection from './config/mongo.js'
import { Server } from 'socket.io'
import { CONSTANTS as CONST } from './common/constants.js'
import { startupServer } from './common/functions.js'
import registerProductSockets from './sockets/registerProductSockets.js'
import logger from './config/logger.js'

const startServer = async () => {
  logger.info('Inicializando ShipNow API')
  await mongoConnection()

  const serverHttp = app.listen(CONST.PORT, () => {
    logger.info(`Servidor ShipNow escuchando en el puerto ${CONST.PORT}`)
    startupServer(CONST.BASEURL)
  })

  const io = new Server(serverHttp)
  registerProductSockets(io)
}

startServer()
