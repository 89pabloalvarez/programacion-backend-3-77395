import { ERROR_DICTIONARY } from '../common/errors.js'

export const blockInProduction = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    const err = new Error(ERROR_DICTIONARY.ROUTE_NOT_FOUND.message)
    err.statusCode = ERROR_DICTIONARY.ROUTE_NOT_FOUND.statusCode
    err.code = ERROR_DICTIONARY.ROUTE_NOT_FOUND.code
    return next(err)
  }
  next()
}
