import { CONSTANTS as CONST } from '../common/constants.js'
import { DomainError } from '../common/errors.js'
import { validateCartItem, validateQuantity, addOrUpdateCartProduct } from '../common/functions.js'
import { cartsRepository } from '../repositories/carts.js'
import { productsRepository } from '../repositories/products.js'
import { CartModel } from '../models/cart.js'
import mongoose from 'mongoose'

class CartsService {
  constructor(cartsRepo, productsRepo) {
    this.cartsRepo = cartsRepo
    this.productsRepo = productsRepo
  }

  // Obtener todos los carritos.
  async getAll({ limit = 10, page = 1, sort, query }) {
    const filter = query ? { category: query } : {}
    const sortOption = sort ? { price: sort === 'asc' ? 1 : -1 } : {}

    return await this.cartsRepo.getAll(filter, {
      page,
      limit,
      sort: sortOption,
      lean: true
    })
  }

  // Obtener un carrito por ID.
  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new DomainError('BAD_ID', { providedId: id, message: CONST.BAD_ID })
    }
    const cart = await this.cartsRepo.getById(id)
    if (!cart) {
      throw new DomainError('PURCHASE_NOT_FOUND', { searchedCart: id, message: CONST.PURCHASE_NOT_FOUND })
    }
    return cart
  }

  // Crea un nuevo carrito.
  async create(body) {
    if (!Array.isArray(body)) {
      throw new DomainError('PRODUCT_CREATE_MUST_BE_ARRAY')
    }

    const productsMap = {}
    const extraFieldsMessages = []
    const errors = []

    for (const item of body) {
      const validationResult = validateCartItem(item)
      if (validationResult.error) {
        errors.push({ item, message: validationResult.error })
        continue
      }
      if (validationResult.extraFieldsMsg) {
        extraFieldsMessages.push(validationResult.extraFieldsMsg)
      }

      const quantityError = validateQuantity(item)
      if (quantityError) {
        errors.push({ item, message: quantityError })
        continue
      }

      const product = await this.productsRepo.getById(item.productId)
      if (!product) {
        errors.push({ item, message: `Producto con id ${item.productId} no encontrado.` })
        continue
      }

      addOrUpdateCartProduct(productsMap, product, item.quantity)
    }

    if (errors.length > 0) {
      throw new DomainError('VALIDATION_FAILED', { errors })
    }

    const newCart = { products: Object.values(productsMap) }
    const createdCart = await this.cartsRepo.create(newCart)

    if (extraFieldsMessages.length > 0) {
      const populatedCart = await CartModel.findById(createdCart._id)
      return {
        success: true,
        message: 'Carrito creado satisfactoriamente. ' + extraFieldsMessages.join(' '),
        cart: populatedCart
      }
    }

    return { success: true, message: 'Carrito creado satisfactoriamente.', cart: createdCart }
  }

  // Agregar producto al carrito.
  async addProduct(cid, pid, quantity) {
    if (quantity === undefined) {
      throw new DomainError('REQUEST_NOT_COMPLETE', { body: 'No definido', message: CONST.QUANTITY_NOT_DEFINED })
    }

    const quantityError = validateQuantity({ productId: pid, quantity })
    if (quantityError) {
      throw new DomainError('QUANTITY_INVALID_VALUE', { quantity, message: quantityError })
    }

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      throw new DomainError('BAD_ID', { productId: pid, message: CONST.BAD_ID })
    }

    const product = await this.productsRepo.getById(pid)
    if (!product) {
      throw new DomainError('PRODUCT_NOT_FOUND', { searchedProduct: pid, message: CONST.PRODUCT_NOT_FOUND })
    }

    const cart = await this.getById(cid)

    const existingProduct = cart.products.find(p => p.product.toString() === pid)
    if (existingProduct) {
      existingProduct.quantity += quantity
    } else {
      cart.products.push({
        product: pid,
        title: product.title,
        price: product.price,
        quantity
      })
    }

    const updatedCart = await this.cartsRepo.update(cid, cart)
    return { success: true, message: 'Carrito actualizado correctamente.', cart: updatedCart }
  }
}

export const cartsService = new CartsService(
  cartsRepository,
  productsRepository
)