import { faker } from '@faker-js/faker'
import { CartModel } from '../../models/cart.js'
import { ProductModel } from '../../models/product.js'
import { CONSTANTS as CONST } from '../../common/constants.js'
import { DomainError } from '../../common/errors.js'
import { validateMockQuantity } from '../../common/functions.js'

export function generateMockCarts(quantity = 10) {
  const parsed = validateMockQuantity(quantity)
  if (!parsed.valid) {
    throw new DomainError('MOCK_QUANTITY_INVALID', { provided: quantity })
  }

  return Array.from({ length: parsed.value }, () => ({
    products: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      product: faker.database.mongodbObjectId(),
      quantity: faker.number.int({ min: 1, max: 5 })
    })),
    state: faker.helpers.arrayElement(CONST.ORDER_STATES),
    priority: faker.helpers.arrayElement(CONST.ORDER_PRIORITIES),
    user: faker.database.mongodbObjectId()
  }))
}

export async function saveMockCarts(quantity = 10) {
  const parsed = validateMockQuantity(quantity)
  if (!parsed.valid) {
    throw new DomainError('MOCK_QUANTITY_INVALID', { provided: quantity })
  }

  const products = await ProductModel.find().select('_id')
  if (products.length === 0) {
    throw new DomainError('MOCKS_NO_PRODUCTS')
  }

  const carts = Array.from({ length: parsed.value }, () => ({
    products: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      product: faker.helpers.arrayElement(products)._id,
      quantity: faker.number.int({ min: 1, max: 5 })
    })),
    state: faker.helpers.arrayElement(CONST.ORDER_STATES),
    priority: faker.helpers.arrayElement(CONST.ORDER_PRIORITIES),
    user: faker.database.mongodbObjectId()
  }))

  try {
    return await CartModel.insertMany(carts)
  } catch (error) {
    throw new DomainError('MOCK_INSERT_FAILED', { originalError: error.message })
  }
}
