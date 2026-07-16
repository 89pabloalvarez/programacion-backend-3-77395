import { CartModel } from '../models/cart.js'

class CartsRepository {
  constructor(model) {
    this.model = model
  }

  // Obtener todos los carritos.
  async getAll(filter = {}, options = {}) {
    return await this.model.paginate(filter, options)
  }

  // Obtener un carrito por ID.
  async getById(id) {
    return await this.model.findById(id)
  }

  // Crea un nuevo carrito.
  async create(cartData) {
    return await this.model.create(cartData)
  }

  // Agregar producto al carrito.
  async update(id, cartData) {
    return await this.model.findByIdAndUpdate(id, cartData, {
      new: true
    })
  }

  // Eliminar carrito.
  async delete(id) {
    return await this.model.findByIdAndDelete(id)
  }
}

export const cartsRepository = new CartsRepository(CartModel)