import { UserModel } from '../models/user.js'

class UsersRepository {
  constructor(model) {
    this.model = model
  }

  // Obtener todos los usuarios.
  async getAll(filter = {}, options = {}) {
    return await this.model.paginate(filter, options)
  }

  // Obtener un usuario por ID.
  async getById(id) {
    return await this.model.findById(id)
  }

  // Crea un nuevo usuario.
  async create(data) {
    return await this.model.create(data)
  }

  // Actualizar un usuario.
  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true })
  }

  // Eliminar un usuario.
  async delete(id) {
    return await this.model.findByIdAndDelete(id)
  }
}

export const usersRepository = new UsersRepository(UserModel)