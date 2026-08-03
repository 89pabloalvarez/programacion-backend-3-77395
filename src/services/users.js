import { CONSTANTS as CONST } from '../common/constants.js'
import { DomainError } from '../common/errors.js'
import { validateFields } from '../common/functions.js'
import { usersRepository } from '../repositories/users.js'
import mongoose from 'mongoose'

class UsersService {
  constructor(usersRepo) {
    this.usersRepo = usersRepo
  }

  // Obtener todos los usuarios.
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

  // Obtener un usuario por ID.
  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new DomainError('BAD_ID', { providedId: id, message: CONST.BAD_ID })
    }
    const user = await this.usersRepo.getById(id)
    if (!user) {
      throw new DomainError('USER_NOT_FOUND', { searchedUser: id, message: CONST.USER_NOT_FOUND })
    }
    return user
  }

  // Crea un nuevo usuario.
  async create(body) {
    const isBodyValid = validateFields(
      body,
      CONST.USER_CREATE_ALLOWED_FIELDS,
      CONST.USER_FIELDS_SCHEMA
    )

    if (!body.password || typeof body.password !== 'string') {
      throw new DomainError('USER_CREATE_NOT_PASSWORD')
    }

    if (!isBodyValid.objectValid) {
      throw new DomainError('VALIDATION_FAILED', isBodyValid)
    }

    return await this.usersRepo.create(body)
  }

  // Actualiza un usuario.
  async update(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new DomainError('BAD_ID', { providedId: id, message: CONST.BAD_ID })
    }

    const isBodyValid = validateFields(
      data,
      CONST.USER_EDIT_ALLOWED_FIELDS,
      CONST.USER_FIELDS_SCHEMA
    )

    if (!isBodyValid.objectValid) {
      throw new DomainError('VALIDATION_FAILED', isBodyValid)
    }

    return await this.usersRepo.update(id, data)
  }

  // Eliminar un usuario.
  async delete(id) {
    const user = await this.usersRepo.delete(id)
    if (!user) {
      throw new DomainError('USER_NOT_FOUND', { searchedUser: id, message: CONST.USER_NOT_FOUND })
    }
    return user
  }
}

export const usersService = new UsersService(usersRepository)
