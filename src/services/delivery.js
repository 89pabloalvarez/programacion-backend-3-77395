import { CONSTANTS as CONST } from '../common/constants.js'
import { DomainError } from '../common/errors.js'
import { deliveryRepository } from '../repositories/delivery.js'
import { CartModel } from '../models/cart.js'
import { UserModel } from '../models/user.js'
import mongoose from 'mongoose'
import logger from '../config/logger.js'

class DeliveryService {
  constructor(deliveryRepo) {
    this.deliveryRepo = deliveryRepo
  }

  async getAll({ limit = 10, page = 1, sort, query }) {
    const filter = query ? { deliveryMan: query } : {}
    const sortOption = sort ? { date: sort === 'asc' ? 1 : -1 } : {}

    return await this.deliveryRepo.getAll(filter, {
      page,
      limit,
      sort: sortOption,
      lean: true
    })
  }

  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new DomainError('BAD_ID', { providedId: id, message: CONST.BAD_ID })
    }

    const delivery = await this.deliveryRepo.getById(id)
    if (!delivery) {
      throw new DomainError('PURCHASE_NOT_FOUND', { searchedDelivery: id, message: CONST.PURCHASE_NOT_FOUND })
    }

    return delivery
  }

  async create(body) {
    if (!body?.order || !body?.deliveryMan) {
      throw new DomainError('REQUEST_NOT_COMPLETE', { body, message: CONST.REQUEST_NOT_COMPLETE })
    }

    if (!mongoose.Types.ObjectId.isValid(body.order) || !mongoose.Types.ObjectId.isValid(body.deliveryMan)) {
      throw new DomainError('BAD_ID', { providedId: body.order || body.deliveryMan, message: CONST.BAD_ID })
    }

    const [cartExists, userExists] = await Promise.all([
      CartModel.exists({ _id: body.order }),
      UserModel.exists({ _id: body.deliveryMan })
    ])

    if (!cartExists) {
      throw new DomainError('PURCHASE_NOT_FOUND', { searchedCart: body.order, message: CONST.PURCHASE_NOT_FOUND })
    }

    if (!userExists) {
      throw new DomainError('USER_NOT_FOUND', { searchedUser: body.deliveryMan, message: CONST.USER_NOT_FOUND })
    }

    const createdDelivery = await this.deliveryRepo.create(body)
    logger.info('Entrega creada correctamente', { deliveryId: createdDelivery._id })
    return createdDelivery
  }

  async update(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new DomainError('BAD_ID', { providedId: id, message: CONST.BAD_ID })
    }

    const updatedDelivery = await this.deliveryRepo.update(id, data)
    if (!updatedDelivery) {
      throw new DomainError('PURCHASE_NOT_FOUND', { searchedDelivery: id, message: CONST.PURCHASE_NOT_FOUND })
    }

    return updatedDelivery
  }

  async delete(id) {
    const deletedDelivery = await this.deliveryRepo.delete(id)
    if (!deletedDelivery) {
      throw new DomainError('PURCHASE_NOT_FOUND', { searchedDelivery: id, message: CONST.PURCHASE_NOT_FOUND })
    }

    return deletedDelivery
  }
}

export const deliveryService = new DeliveryService(deliveryRepository)
