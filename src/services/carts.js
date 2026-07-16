import { CONSTANTS as CONST } from '../common/constants.js'
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
      const err = new Error(CONST.BAD_ID)
      err.statusCode = 400
      err.details = { providedId: id, message: CONST.BAD_ID }
      throw err
    }
    const cart = await this.cartsRepo.getById(id)
    if (!cart) {
      const err = new Error(CONST.PURCHASE_NOT_FOUND)
      err.statusCode = 404
      err.details = { searchedCart: id, message: CONST.PURCHASE_NOT_FOUND }
      throw err
    }
    return cart
  }

  // Crea un nuevo carrito.
  async create(body) {
    if (!Array.isArray(body)) {
      const err = new Error(CONST.PRODUCT_CREATE_MUST_BE_ARRAY)
      err.statusCode = 400
      throw err
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
      const err = new Error("Errores en la creación del carrito.")
      err.statusCode = 400
      err.details = errors
      throw err
    }

    const newCart = { products: Object.values(productsMap) }
    const createdCart = await this.cartsRepo.create(newCart)

    if (extraFieldsMessages.length > 0) {
      const populatedCart = await CartModel.findById(createdCart._id)
      return {
        success: true,
        message: "Carrito creado satisfactoriamente. " + extraFieldsMessages.join(" "),
        cart: populatedCart
      }
    }

    return { success: true, message: "Carrito creado satisfactoriamente.", cart: createdCart }
  }

  // Agregar producto al carrito.
  async addProduct(cid, pid, quantity) {
    if (quantity === undefined) {
      const err = new Error(CONST.REQUEST_NOT_COMPLETE)
      err.statusCode = 400
      err.details = { body: "No definido", message: CONST.QUANTITY_NOT_DEFINED }
      throw err
    }

    const quantityError = validateQuantity({ productId: pid, quantity })
    if (quantityError) {
      const err = new Error(CONST.QUANTITY_INVALID_VALUE)
      err.statusCode = 400
      err.details = { quantity, message: quantityError }
      throw err
    }

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      const err = new Error(CONST.BAD_ID)
      err.statusCode = 400
      err.details = { productId: pid, message: CONST.BAD_ID }
      throw err
    }

    const product = await this.productsRepo.getById(pid)
    if (!product) {
      const err = new Error(CONST.PRODUCT_NOT_FOUND)
      err.statusCode = 404
      err.details = { searchedProduct: pid, message: CONST.PRODUCT_NOT_FOUND }
      throw err
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
    return { success: true, message: "Carrito actualizado correctamente.", cart: updatedCart }
  }
}

export const cartsService = new CartsService(
  cartsRepository,
  productsRepository
)