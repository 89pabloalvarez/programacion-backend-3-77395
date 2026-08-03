import { CONSTANTS as CONST } from './constants.js'

export const ERROR_DICTIONARY = Object.freeze({
  BAD_ID: { statusCode: 400, code: 'BAD_ID', message: CONST.BAD_ID },
  USER_NOT_FOUND: { statusCode: 404, code: 'USER_NOT_FOUND', message: CONST.USER_NOT_FOUND },
  PRODUCT_NOT_FOUND: { statusCode: 404, code: 'PRODUCT_NOT_FOUND', message: CONST.PRODUCT_NOT_FOUND },
  PURCHASE_NOT_FOUND: { statusCode: 404, code: 'PURCHASE_NOT_FOUND', message: CONST.PURCHASE_NOT_FOUND },
  USER_CREATE_NOT_PASSWORD: { statusCode: 400, code: 'USER_CREATE_NOT_PASSWORD', message: CONST.USER_CREATE_NOT_PASSWORD },
  PRODUCT_CREATE_MUST_BE_ARRAY: { statusCode: 400, code: 'PRODUCT_CREATE_MUST_BE_ARRAY', message: CONST.PRODUCT_CREATE_MUST_BE_ARRAY },
  REQUEST_NOT_COMPLETE: { statusCode: 400, code: 'REQUEST_NOT_COMPLETE', message: CONST.REQUEST_NOT_COMPLETE },
  QUANTITY_NOT_DEFINED: { statusCode: 400, code: 'QUANTITY_NOT_DEFINED', message: CONST.QUANTITY_NOT_DEFINED },
  QUANTITY_INVALID_VALUE: { statusCode: 400, code: 'QUANTITY_INVALID_VALUE', message: CONST.QUANTITY_INVALID_VALUE },
  VALIDATION_FAILED: { statusCode: 400, code: 'VALIDATION_FAILED', message: CONST.VALIDATION_FAILED },
  MOCK_QUANTITY_INVALID: { statusCode: 400, code: 'MOCK_QUANTITY_INVALID', message: CONST.MOCK_QUANTITY_INVALID },
  MOCK_INSERT_FAILED: { statusCode: 500, code: 'MOCK_INSERT_FAILED', message: CONST.MOCK_INSERT_FAILED },
  MOCKS_NO_PRODUCTS: { statusCode: 500, code: 'MOCKS_NO_PRODUCTS', message: CONST.MOCKS_NO_PRODUCTS },
  SERVER_ERROR: { statusCode: 500, code: 'SERVER_ERROR', message: CONST.SERVER_ERROR }
})

export class DomainError extends Error {
  constructor(code, details = null) {
    const error = ERROR_DICTIONARY[code] || ERROR_DICTIONARY.SERVER_ERROR
    super(error.message)
    this.name = 'DomainError'
    this.code = error.code
    this.statusCode = error.statusCode
    if (details !== null) this.details = details
  }
}
