import { deliveryService } from '../services/delivery.js'

class DeliveryController {
  constructor(service) {
    this.service = service
  }

  getAll = async (req, res, next) => {
    try {
      const { limit, page, sort, query } = req.query
      const response = await this.service.getAll({ limit, page, sort, query })
      res.json(response)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req, res, next) => {
    try {
      const { id } = req.params
      const response = await this.service.getById(id)
      res.json(response)
    } catch (error) {
      next(error)
    }
  }

  create = async (req, res, next) => {
    try {
      const response = await this.service.create(req.body)
      res.status(201).json(response)
    } catch (error) {
      next(error)
    }
  }

  update = async (req, res, next) => {
    try {
      const { id } = req.params
      const response = await this.service.update(id, req.body)
      res.json(response)
    } catch (error) {
      next(error)
    }
  }

  delete = async (req, res, next) => {
    try {
      const { id } = req.params
      const response = await this.service.delete(id)
      res.json(response)
    } catch (error) {
      next(error)
    }
  }

  uploadReceipt = async (req, res, next) => {
    try {
      const { id } = req.params
      const { documentType } = req.body || {}
      const response = await this.service.uploadReceipt(id, req.file, documentType)
      res.status(201).json(response)
    } catch (error) {
      next(error)
    }
  }
}

export const deliveryController = new DeliveryController(deliveryService)
