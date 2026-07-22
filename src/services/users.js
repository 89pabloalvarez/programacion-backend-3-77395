import { CONSTANTS as CONST } from '../common/constants.js'
import { validateFields } from '../common/functions.js'
import { usersRepository } from '../repositories/users.js'
import mongoose from 'mongoose'

class UsersService {
  constructor(usersRepo) {
    this.usersRepo = usersRepo
  }

  // Obtener todos los usuerios.
  async getAll({ limit = 10, page = 1, sort, query }) {

    const filter = query ? { status: query } : {}
    const sortOption = sort ? { name: sort === 'asc' ? 1 : -1 } : {}

    return await this.usersRepo.getAll(filter, {
      page,
      limit,
      sort: sortOption,
      lean: true
    })
  }

  // Obtener un usuerio por ID.
  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error(CONST.BAD_ID)
      err.statusCode = 400
      err.details = { providedId: id, message: CONST.BAD_ID }
      throw err
    }
    const user = await this.usersRepo.getById(id)
    if (!user) {
      const err = new Error(CONST.USER_NOT_FOUND)
      err.statusCode = 404
      err.details = { searchedUser: id, message: CONST.USER_NOT_FOUND }
      throw err
    }
    return user
  }

  // Crea un nuevo usuerio.
  async create(body) {
    const isBodyValid = validateFields(
      body,
      CONST.USER_CREATE_ALLOWED_FIELDS,
      CONST.USER_FIELDS_SCHEMA
    )

    if (!isBodyValid.objectValid) {
      const err = new Error('Validación fallida')
      err.statusCode = 400
      err.details = isBodyValid
      throw err
    }

    return await this.usersRepo.create(body)
  }

  // Actualiza un usuerio.
  async update(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error(CONST.BAD_ID)
      err.statusCode = 400
      err.details = { providedId: id, message: CONST.BAD_ID }
      throw err
    }

    const isBodyValid = validateFields(
      data,
      CONST.USER_EDIT_ALLOWED_FIELDS,
      CONST.USER_FIELDS_SCHEMA
    )

    if (!isBodyValid.objectValid) {
      const err = new Error('Validación fallida')
      err.statusCode = 400
      err.details = isBodyValid
      throw err
    }

    return await this.usersRepo.update(id, data)
  }

  // Eliminar un usuerio.
  async delete(id) {
    const user = await this.usersRepo.delete(id)
    if (!user) {
      const err = new Error(CONST.USER_NOT_FOUND)
      err.details = { searchedUser: id, message: CONST.USER_NOT_FOUND }
      throw err
    }
    return user
  }
}

export const usersService = new UsersService(usersRepository)