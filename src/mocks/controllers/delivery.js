import { generateMockDeliveries, saveMockDeliveries } from '../services/delivery.js'
import { validateMockQuantity } from '../../common/functions.js'
import { DomainError } from '../../common/errors.js'
import logger from '../../config/logger.js'

export async function getMockDeliveries(req, res, next) {
  try {
    const parsed = validateMockQuantity(req.query.quantity)
    if (!parsed.valid) {
      throw new DomainError('MOCK_QUANTITY_INVALID', { provided: req.query.quantity })
    }

    const deliveries = await generateMockDeliveries(parsed.value)
    res.json(deliveries)
  } catch (error) {
    next(error)
  }
}

export async function insertMockDeliveries(req, res, next) {
  try {
    const parsed = validateMockQuantity(req.query.quantity)
    if (!parsed.valid) {
      logger.warn('Cantidad de mocks inválida en entregas', { provided: req.query.quantity })
      throw new DomainError('MOCK_QUANTITY_INVALID', { provided: req.query.quantity })
    }

    const inserted = await saveMockDeliveries(parsed.value)
    res.json({ insertedCount: inserted.length })
  } catch (error) {
    next(error)
  }
}
