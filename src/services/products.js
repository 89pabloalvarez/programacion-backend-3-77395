import { CONSTANTS as CONST } from '../common/constants.js'
import { DomainError } from '../common/errors.js'
import { validateFields } from '../common/functions.js'
import { productsRepository } from '../repositories/products.js'
import mongoose from 'mongoose'

class ProductsService {
  constructor(productsRepo) {
    this.productsRepo = productsRepo
  }

  // Obtener todos los productos.
  async getAll({ limit = 10, page = 1, sort, query }) {
    let filter = {}
    if (query) {
      if (query === 'true' || query === 'false') {
        filter = { status: query === 'true' }
      } else {
        filter = { category: { $regex: query, $options: 'i' } }
      }
    }
    const sortOption = sort ? { price: sort === 'asc' ? 1 : -1 } : {}

    return await this.productsRepo.getAll(filter, {
      page,
      limit,
      sort: sortOption,
      lean: true
    })
  }

  // Obtener un producto por ID.
  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new DomainError('BAD_ID', { providedId: id, message: CONST.BAD_ID })
    }
    const product = await this.productsRepo.getById(id)
    if (!product) {
      throw new DomainError('PRODUCT_NOT_FOUND', { searchedProduct: id, message: CONST.PRODUCT_NOT_FOUND })
    }
    return product
  }

  // Crea un nuevo producto.
  async create(body) {
    const isBodyValid = validateFields(
      body,
      CONST.PRODUCT_CREATE_ALLOWED_FIELDS,
      CONST.PRODUCT_FIELDS_SCHEMA
    )

    if (!isBodyValid.objectValid) {
      throw new DomainError('VALIDATION_FAILED', isBodyValid)
    }

    return await this.productsRepo.create(body)
  }

  // Actualiza un producto.
  async update(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new DomainError('BAD_ID', { providedId: id, message: CONST.BAD_ID })
    }

    const isBodyValid = validateFields(
      data,
      CONST.PRODUCT_EDIT_ALLOWED_FIELDS,
      CONST.PRODUCT_FIELDS_SCHEMA
    )

    if (!isBodyValid.objectValid) {
      throw new DomainError('VALIDATION_FAILED', isBodyValid)
    }

    return await this.productsRepo.update(id, data)
  }

  // Eliminar un producto.
  async delete(id) {
    const product = await this.productsRepo.delete(id)
    if (!product) {
      throw new DomainError('PRODUCT_NOT_FOUND', { searchedProduct: id, message: CONST.PRODUCT_NOT_FOUND })
    }
    return product
  }
}

export const productsService = new ProductsService(productsRepository)
