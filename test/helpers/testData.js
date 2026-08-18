import { UserModel } from '../../src/models/user.js'
import { ProductModel } from '../../src/models/product.js'
import { CartModel } from '../../src/models/cart.js'

let counter = 0
const unique = () => `${Date.now()}_${counter++}`

// Usuarios
export const buildUserPayload = (overrides = {}) => ({
  name: 'Test',
  last_name: 'User',
  email: `test.user.${unique()}@shipnow.test`,
  password: 'Test1234',
  role: ['user'],
  status: true,
  ...overrides
})

export const createTestUser = async (overrides = {}) => {
  return await UserModel.create(buildUserPayload(overrides))
}

export const deleteUsersByIds = async (ids = []) => {
  if (ids.length) await UserModel.deleteMany({ _id: { $in: ids } })
}

// Productos
export const buildProductPayload = (overrides = {}) => ({
  title: 'Producto de test',
  price: 100,
  category: 'testing',
  description: 'Producto creado exclusivamente para tests automatizados',
  stock: 50,
  ...overrides
})

export const createTestProduct = async (overrides = {}) => {
  return await ProductModel.create(buildProductPayload(overrides))
}

export const deleteProductsByIds = async (ids = []) => {
  if (ids.length) await ProductModel.deleteMany({ _id: { $in: ids } })
}

// Pedidos (carts)
export const deleteCartsByIds = async (ids = []) => {
  if (ids.length) await CartModel.deleteMany({ _id: { $in: ids } })
}
