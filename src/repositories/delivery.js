import { DeliveryModel } from '../models/delivery.js'

class DeliveryRepository {
  constructor(model) {
    this.model = model
  }

  async getAll(filter = {}, options = {}) {
    return await this.model.paginate(filter, options)
  }

  async getById(id) {
    return await this.model.findById(id)
  }

  async create(data) {
    return await this.model.create(data)
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true })
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id)
  }
}

export const deliveryRepository = new DeliveryRepository(DeliveryModel)
