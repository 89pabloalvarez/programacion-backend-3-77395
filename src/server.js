import app from './config/app.js'
import mongoConnection from './config/mongo.js'
import { Server } from 'socket.io'
import { CONSTANTS as CONST } from './common/constants.js'
import { startupServer } from './common/functions.js'
import registerProductSockets from './sockets/registerProductSockets.js'
import { validateEnv } from './config/validateEnv.js'
import logger from './config/logger.js'

const startServer = async () => {

  validateEnv()

  logger.info('Inicializando ShipNow API', { environment: CONST.NODE_ENV })

  try {
    await mongoConnection()
  } catch (error) {
    logger.fatal('No se pudo iniciar el servidor: falló la conexión a la base de datos.')
    process.exit(1)
  }

  const serverHttp = app.listen(CONST.PORT, () => {
    logger.info(`Servidor ShipNow escuchando en el puerto ${CONST.PORT}`)
    startupServer(CONST.BASEURL)
  })

  const io = new Server(serverHttp)
  registerProductSockets(io)
}

startServer()
