import { faker } from '@faker-js/faker'
import { ProductModel } from '../../models/product.js'
import { DomainError } from '../../common/errors.js'
import { validateMockQuantity } from '../../common/functions.js'

export function generateMockProducts(quantity = 10) {
  const parsed = validateMockQuantity(quantity)
  if (!parsed.valid) {
    throw new DomainError('MOCK_QUANTITY_INVALID', { provided: quantity })
  }

  return Array.from({ length: parsed.value }, () => ({
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    code: faker.string.alphanumeric({ length: 10 }),
    category: faker.commerce.department(),
    stock: faker.number.int({ min: 0, max: 100 }),
    thumbnails: [
      faker.image.urlLoremFlickr({ category: 'product', width: 640, height: 480 })
    ],
    status: faker.datatype.boolean()
  }))
}

export async function saveMockProducts(products) {
  try {
    return await ProductModel.insertMany(products)
  } catch (error) {
    throw new DomainError('MOCK_INSERT_FAILED', { originalError: error.message })
  }
}
