import { faker } from '@faker-js/faker'
import { CartModel } from '../../models/cart.js'
import { ProductModel } from '../../models/product.js'
import { CONSTANTS as CONST } from '../../common/constants.js'

export function generateMockCarts(quantity = 10) {
  return Array.from({ length: quantity }, () => ({
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
  const products = await ProductModel.find().select('_id')
  if (products.length === 0) throw new Error('No hay productos en la DB')

  const carts = Array.from({ length: quantity }, () => ({
    products: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      product: faker.helpers.arrayElement(products)._id,
      quantity: faker.number.int({ min: 1, max: 5 })
    })),
    state: faker.helpers.arrayElement(CONST.ORDER_STATES),
    priority: faker.helpers.arrayElement(CONST.ORDER_PRIORITIES),
    user: faker.database.mongodbObjectId()
  }))

  return await CartModel.insertMany(carts)
}