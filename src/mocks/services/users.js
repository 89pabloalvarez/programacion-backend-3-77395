import { faker } from '@faker-js/faker'
import { UserModel } from '../../models/user.js'
import { CONSTANTS as CONST } from '../../common/constants.js'

export function generateMockUsers(quantity = 10) {
  const roles = CONST.ROLES || ['admin', 'user', 'seller']
  return Array.from({ length: quantity }, () => ({
    name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    status: faker.datatype.boolean(),
    role: [faker.helpers.arrayElement(roles)]
  }))
}

export async function saveMockUsers(users) {
  return await UserModel.insertMany(users)
}