import { productsService } from '../services/products.js'

class ProductsController {
  constructor(service) {
    this.service = service
  }

  // Obtener todos los productos.
  getAll = async (req, res, next) => {
    try {
      const { limit, page, sort, query } = req.query
      const response = await this.service.getAll({ limit, page, sort, query })
      res.json(response)
    } catch (error) {
      next(error)
    }
  }

  // Obtener un producto por ID.
  getById = async (req, res, next) => {
    try {
      const { id } = req.params
      const response = await this.service.getById(id)
      res.json(response)
    } catch (error) {
      next(error)
    }
  }

  // Crea un nuevo producto.
  create = async (req, res, next) => {
    try {
      const response = await this.service.create(req.body)
      res.status(201).json(response)
    } catch (error) {
      next(error)
    }
  }

  // Actualizar producto.
  update = async (req, res, next) => {
    try {
      const { id } = req.params
      const response = await this.service.update(id, req.body)
      res.json(response)
    } catch (error) {
      next(error)
    }
  }

  // Eliminar producto.
  delete = async (req, res, next) => {
    try {
      const { id } = req.params
      const response = await this.service.delete(id)
      res.json(response)
    } catch (error) {
      next(error)
    }
  }
}

export const productsController = new ProductsController(productsService)