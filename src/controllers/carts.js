import { cartsService } from '../services/carts.js'

class CartsController {
  constructor(service) {
    this.service = service
  }

  // Obtener todos los carritos.
  getAll = async (req, res, next) => {
    try {
      const { limit, page, sort, query } = req.query
      const response = await this.service.getAll({ limit, page, sort, query })
      res.json(response)
    } catch (error) {
      next(error)
    }
  }

  // Obtener un carrito por ID.
  getById = async (req, res, next) => {
    try {
      const { id } = req.params
      const response = await this.service.getById(id)
      res.json(response)
    } catch (error) {
      next(error)
    }
  }

  // Crea un nuevo carrito.
  create = async (req, res, next) => {
    try {
      const response = await this.service.create(req.body)
      res.status(201).json(response)
    } catch (error) {
      next(error)
    }
  }

  // Agregar producto a carrito.
  addProduct = async (req, res, next) => {
    try {
      const { cid, pid } = req.params
      const quantity = req.body?.quantity
      const response = await this.service.addProduct(cid, pid, quantity)
      res.json(response)
    } catch (error) {
      next(error)
    }
  }

  // Reemplazar todos los productos del carrito.
  updateProducts = async (req, res, next) => {
    try {
      const { cid } = req.params
      const response = await this.service.updateProducts(cid, req.body)
      res.json(response)
    } catch (error) {
      next(error)
    }
  }

  // Actualizar solo la cantidad de un producto en el carrito.
  updateQuantity = async (req, res, next) => {
    try {
      const { cid, pid } = req.params
      const quantity = req.body?.quantity
      const response = await this.service.updateQuantity(cid, pid, quantity)
      res.json(response)
    } catch (error) {
      next(error)
    }
  }

  // Eliminar un producto del carrito.
  deleteProduct = async (req, res, next) => {
    try {
      const { cid, pid } = req.params
      const response = await this.service.deleteProduct(cid, pid)
      res.json(response)
    } catch (error) {
      next(error)
    }
  }

  // Vaciar todos los productos del carrito.
  deleteAllProducts = async (req, res, next) => {
    try {
      const { cid } = req.params
      const response = await this.service.deleteAllProducts(cid)
      res.json(response)
    } catch (error) {
      next(error)
    }
  }
}

export const cartsController = new CartsController(cartsService)
