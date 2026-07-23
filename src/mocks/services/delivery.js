import { faker } from '@faker-js/faker'
import { CONSTANTS as CONST } from '../../common/constants.js'
import { DeliveryModel } from '../../models/delivery.js'

export function generateMockDeliveries(quantity = 10) {
  return Array.from({ length: quantity }, () => ({
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
  const deliveries = Array.from({ length: quantity }, () => ({
    order: faker.database.mongodbObjectId(),
    deliveryMan: faker.database.mongodbObjectId(), // solo guardamos el id
    date: faker.date.recent()
  }))
  return await DeliveryModel.insertMany(deliveries)
}