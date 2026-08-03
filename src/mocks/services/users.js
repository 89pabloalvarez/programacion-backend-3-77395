import { faker } from '@faker-js/faker'
import { UserModel } from '../../models/user.js'
import { CONSTANTS as CONST } from '../../common/constants.js'
import { DomainError } from '../../common/errors.js'
import { validateMockQuantity } from '../../common/functions.js'

export function generateMockUsers(quantity = 10) {
  const parsed = validateMockQuantity(quantity)
  if (!parsed.valid) {
    throw new DomainError('MOCK_QUANTITY_INVALID', { provided: quantity })
  }

  return Array.from({ length: parsed.value }, () => ({
    name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    status: faker.datatype.boolean(),
    role: [faker.helpers.arrayElement(CONST.USER_ROLES)]
  }))
}

export async function saveMockUsers(users) {
  try {
    return await UserModel.insertMany(users)
  } catch (error) {
    throw new DomainError('MOCK_INSERT_FAILED', { originalError: error.message })
  }
}
