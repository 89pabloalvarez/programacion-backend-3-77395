import { ProductModel } from '../models/product.js'

class ProductsRepository {
  constructor(model) {
    this.model = model
  }

  // Obtener todos los productos.
  async getAll(filter = {}, options = {}) {
    return await this.model.paginate(filter, options)
  }

  // Obtener un producto por ID.
  async getById(id) {
    return await this.model.findById(id)
  }

  // Crea un nuevo producto.
  async create(data) {
    return await this.model.create(data)
  }

  // Actualizar un producto.
  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true })
  }

  // Eliminar un producto.
  async delete(id) {
    return await this.model.findByIdAndDelete(id)
  }
}

export const productsRepository = new ProductsRepository(ProductModel)