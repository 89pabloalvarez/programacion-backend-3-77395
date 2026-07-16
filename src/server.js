import app from './config/app.js'
import mongoConnection from './config/mongo.js'
import { Server } from 'socket.io'
import { CONSTANTS as CONST } from './common/constants.js'
import { startupServer } from './common/functions.js'
import apiRouter from './routes/index.js'
import viewsRouter from './views/views-router.js'
import registerProductSockets from './sockets/registerProductSockets.js'
import { errorHandler } from './middlewares/errorHandler.js'

const startServer = async () => {
  await mongoConnection()

  app.use(CONST.DIR_URL_ROOT, apiRouter)
  app.use('/', viewsRouter)
  app.use(errorHandler)

  const serverHttp = app.listen(CONST.PORT, () => {
    startupServer(CONST.BASEURL)
  })

  const io = new Server(serverHttp)
  registerProductSockets(io)
}

startServer()