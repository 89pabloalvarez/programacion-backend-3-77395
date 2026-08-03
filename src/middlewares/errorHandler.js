import { CONSTANTS as CONST } from '../common/constants.js'
import { ERROR_DICTIONARY } from '../common/errors.js'
import logger from '../config/logger.js'

export const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    err.statusCode = 400
    err.code = 'VALIDATION_FAILED'
    err.details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }))
  }

  if (err.name === 'CastError') {
    err.statusCode = 400
    err.code = 'BAD_ID'
    err.details = {
      field: err.path === '_id' ? 'id' : err.path,
      value: err.value,
      message: CONST.BAD_ID
    }
  }

  const status = err.statusCode || ERROR_DICTIONARY.SERVER_ERROR.statusCode
  const code = err.code || ERROR_DICTIONARY.SERVER_ERROR.code
  const message = err.message || ERROR_DICTIONARY.SERVER_ERROR.message

  if (status >= 500) {
    logger.error('Error inesperado del servidor', { code, message, method: req.method, path: req.url, stack: err.stack })
  } else {
    logger.warn('Error de negocio o validación', { code, message, method: req.method, path: req.url, details: err.details })
  }

  res.status(status).json({
    status: 'error',
    code,
    message,
    details: err.details || null
  })
}