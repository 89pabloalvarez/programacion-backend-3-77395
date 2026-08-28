import { UserModel } from '../../src/models/user.js'
import { ProductModel } from '../../src/models/product.js'
import { CartModel } from '../../src/models/cart.js'
import { DeliveryModel } from '../../src/models/delivery.js'
import fs from 'fs'
import path from 'path'

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

export const createTestDelivery = async (overrides = {}) => {
  const product = await ProductModel.create({
    title: 'Producto de test (delivery)',
    price: 50,
    category: 'testing',
    description: 'Producto creado exclusivamente para tests de delivery',
    stock: 20
  })

  const cart = await CartModel.create({
    products: [{ product: product._id, quantity: 1 }]
  })

  const deliveryMan = await createTestUser({ role: ['deliveryMan'] })

  const delivery = await DeliveryModel.create({
    order: cart._id,
    deliveryMan: deliveryMan._id,
    ...overrides
  })

  return { delivery, product, cart, deliveryMan }
}

export const deleteDeliveriesByIds = async (ids = []) => {
  if (ids.length) await DeliveryModel.deleteMany({ _id: { $in: ids } })
}

export const deleteUploadedFilesByRelativePaths = async (relativePaths = []) => {
  for (const relativePath of relativePaths) {
    if (!relativePath) continue
    try {
      await fs.promises.unlink(path.resolve(process.cwd(), relativePath))
    } catch {
      // si ya no existe no es un error de test
    }
  }
}
