import logger from '../config/logger.js'

const SENSITIVE_KEYS = ['password', 'pass', 'token', 'authorization', 'secret']

const MAX_LOGGED_BODY_LENGTH = 2000

const redact = (payload) => {
  if (!payload || typeof payload !== 'object') return payload

  const clone = Array.isArray(payload) ? [...payload] : { ...payload }
  for (const key of Object.keys(clone)) {
    if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
      clone[key] = '***REDACTED***'
    } else if (clone[key] && typeof clone[key] === 'object') {
      clone[key] = redact(clone[key])
    }
  }
  return clone
}

const toLoggableBody = (payload) => {
  if (payload === undefined || payload === null) return payload

  let value = payload
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value)
    } catch {
    }
  }

  const sanitized = redact(value)

  try {
    const asString = typeof sanitized === 'string' ? sanitized : JSON.stringify(sanitized)
    if (asString && asString.length > MAX_LOGGED_BODY_LENGTH) {
      return `${asString.slice(0, MAX_LOGGED_BODY_LENGTH)}... [truncado, ${asString.length} chars]`
    }
    return sanitized
  } catch {
    return '[no serializable]'
  }
}

export const loggerRequest = (req, res, next) => {
    logger.http('Solicitud recibida', {
        method: req.method,
        path: req.url,
        body: toLoggableBody(req.body)
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
                body: toLoggableBody(body)
            })
        } catch (error) {
            logger.error('No se pudo registrar la respuesta', { error: error.message })
        }
        return originalSend.call(this, body)
    }
    next()
}