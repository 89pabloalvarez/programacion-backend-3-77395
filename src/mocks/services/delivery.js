import { faker } from '@faker-js/faker'
import { CONSTANTS as CONST } from '../../common/constants.js'
import { DeliveryModel } from '../../models/delivery.js'
import { DomainError } from '../../common/errors.js'
import { validateMockQuantity } from '../../common/functions.js'

export function generateMockDeliveries(quantity = 10) {
  const parsed = validateMockQuantity(quantity)
  if (!parsed.valid) {
    throw new DomainError('MOCK_QUANTITY_INVALID', { provided: quantity })
  }

  return Array.from({ length: parsed.value }, () => ({
    order: faker.database.mongodbObjectId(),
    deliveryMan: {
      _id: faker.database.mongodbObjectId(),
      name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      role: 'dealer'
    },
    date: faker.date.recent()
  }))
}

export async function saveMockDeliveries(quantity = 10) {
  const parsed = validateMockQuantity(quantity)
  if (!parsed.valid) {
    throw new DomainError('MOCK_QUANTITY_INVALID', { provided: quantity })
  }

  const deliveries = Array.from({ length: parsed.value }, () => ({
    order: faker.database.mongodbObjectId(),
    deliveryMan: faker.database.mongodbObjectId(),
    date: faker.date.recent()
  }))

  try {
    return await DeliveryModel.insertMany(deliveries)
  } catch (error) {
    throw new DomainError('MOCK_INSERT_FAILED', { originalError: error.message })
  }
}
