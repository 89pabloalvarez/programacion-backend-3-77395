import express from 'express'
import handlebars from 'express-handlebars'
import swaggerUi from 'swagger-ui-express'
import { loggerRequest, loggerResponse } from '../middlewares/logger.js'
import { errorHandler } from '../middlewares/errorHandler.js'
import { ERROR_DICTIONARY } from '../common/errors.js'
import { CONSTANTS as CONST } from '../common/constants.js'
import apiRouter from '../routes/index.js'
import viewsRouter from '../views/views-router.js'
import { swaggerSpec } from './swagger.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('src/public'))

app.use(loggerRequest)
app.use(loggerResponse)

app.engine('handlebars', handlebars.engine({
    partialsDir: 'src/views/partials',
    helpers: {
        eq: (a, b) => a === b
    }
}))
app.set('views', 'src/views')
app.set('view engine', 'handlebars')

app.use(CONST.DIR_URL_ROOT, apiRouter)
app.use('/', viewsRouter)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use((req, res, next) => {
  const err = new Error(ERROR_DICTIONARY.ROUTE_NOT_FOUND.message)
  err.statusCode = ERROR_DICTIONARY.ROUTE_NOT_FOUND.statusCode
  err.code = ERROR_DICTIONARY.ROUTE_NOT_FOUND.code
  next(err)
})
app.use(errorHandler)

export default app
