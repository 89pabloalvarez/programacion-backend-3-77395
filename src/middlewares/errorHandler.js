import { CONSTANTS as CONST } from '../common/constants.js'

export const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err)

  if (err.name === 'ValidationError') {
    err.statusCode = 400
    err.details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }))
  }

  if (err.name === 'CastError') {
    err.statusCode = 400
    err.details = {
      field: err.path === '_id' ? 'id' : err.path,
      value: err.value,
      message: CONST.BAD_ID
    }
  }

  const status = err.statusCode || 500
  const message = err.message || CONST.SERVER_ERROR

  res.status(status).json({
    error: 'Si',
    message,
    details: err.details || null
  })
}