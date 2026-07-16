import express from 'express'
import handlebars from 'express-handlebars'
import { loggerRequest, loggerResponse } from '../middlewares/logger.js'

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

export default app