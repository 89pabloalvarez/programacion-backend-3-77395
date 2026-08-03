import { generateMockUsers, saveMockUsers } from '../services/users.js'
import { validateMockQuantity } from '../../common/functions.js'
import { DomainError } from '../../common/errors.js'

export async function getMockUsers(req, res, next) {
  try {
    const parsed = validateMockQuantity(req.query.quantity)
    if (!parsed.valid) {
      throw new DomainError('MOCK_QUANTITY_INVALID', { provided: req.query.quantity })
    }

    const users = generateMockUsers(parsed.value)
    res.json(users)
  } catch (error) {
    next(error)
  }
}

export async function insertMockUsers(req, res, next) {
  try {
    const parsed = validateMockQuantity(req.query.quantity)
    if (!parsed.valid) {
      throw new DomainError('MOCK_QUANTITY_INVALID', { provided: req.query.quantity })
    }

    const users = generateMockUsers(parsed.value)
    const inserted = await saveMockUsers(users)
    res.json({ insertedQuantity: inserted.length })
  } catch (error) {
    next(error)
  }
}
