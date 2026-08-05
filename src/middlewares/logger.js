import logger from '../config/logger.js'

export const loggerRequest = (req, res, next) => {
    logger.http('Solicitud recibida', {
        method: req.method,
        path: req.url,
        body: req.body
    })
    next()
}

export const loggerResponse = (req, res, next) => {
    const originalSend = res.send
    res.send = function (body) {
        try {
            logger.http('Respuesta enviada', {
                method: req.method,
                path: req.url,
                status: res.statusCode,
                body
            })
        } catch (error) {
            logger.error('No se pudo registrar la respuesta', { error: error.message })
        }
        return originalSend.call(this, body)
    }
    next()
}