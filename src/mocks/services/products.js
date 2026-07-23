import { faker } from '@faker-js/faker'
import { ProductModel } from '../../models/product.js'

export function generateMockProducts(quantity = 10) {
  return Array.from({ length: quantity }, () => ({
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
  return await ProductModel.insertMany(products)
}