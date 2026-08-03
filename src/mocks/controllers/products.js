import { generateMockProducts, saveMockProducts } from '../services/products.js'
import { validateMockQuantity } from '../../common/functions.js'
import { DomainError } from '../../common/errors.js'

export async function getMockProducts(req, res, next) {
  try {
    const parsed = validateMockQuantity(req.query.quantity)
    if (!parsed.valid) {
      throw new DomainError('MOCK_QUANTITY_INVALID', { provided: req.query.quantity })
    }

    const products = generateMockProducts(parsed.value)
    res.json(products)
  } catch (error) {
    next(error)
  }
}

export async function insertMockProducts(req, res, next) {
  try {
    const parsed = validateMockQuantity(req.query.quantity)
    if (!parsed.valid) {
      throw new DomainError('MOCK_QUANTITY_INVALID', { provided: req.query.quantity })
    }

    const products = generateMockProducts(parsed.value)
    const inserted = await saveMockProducts(products)
    res.json({ insertedQuantity: inserted.length })
  } catch (error) {
    next(error)
  }
}
