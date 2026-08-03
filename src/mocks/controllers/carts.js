import { generateMockCarts, saveMockCarts } from '../services/carts.js'
import { validateMockQuantity } from '../../common/functions.js'
import { DomainError } from '../../common/errors.js'
import logger from '../../config/logger.js'

export async function getMockCarts(req, res, next) {
  try {
    const parsed = validateMockQuantity(req.query.quantity)
    if (!parsed.valid) {
      throw new DomainError('MOCK_QUANTITY_INVALID', { provided: req.query.quantity })
    }

    const carts = generateMockCarts(parsed.value)
    res.json(carts)
  } catch (error) {
    next(error)
  }
}

export async function insertMockCarts(req, res, next) {
  try {
    const parsed = validateMockQuantity(req.query.quantity)
    if (!parsed.valid) {
      logger.warn('Cantidad de mocks inválida en carritos', { provided: req.query.quantity })
      throw new DomainError('MOCK_QUANTITY_INVALID', { provided: req.query.quantity })
    }

    const inserted = await saveMockCarts(parsed.value)
    res.json({ insertedCount: inserted.length })
  } catch (error) {
    next(error)
  }
}
