import { CONSTANTS as CONST } from '../common/constants.js'
import { DomainError } from '../common/errors.js'
import { validateFields } from '../common/functions.js'
import { usersRepository } from '../repositories/users.js'
import { deleteUploadedFile, moveUploadedFile, UPLOAD_PATHS } from '../config/multer.js'
import mongoose from 'mongoose'
import path from 'path'
import logger from '../config/logger.js'

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

    const createdUser = await this.usersRepo.create(body)
    logger.info('Usuario creado correctamente', { userId: createdUser._id })
    return createdUser
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

  async uploadDocument(userId, file, documentType) {
    if (!file) {
      throw new DomainError('FILE_REQUIRED')
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      await deleteUploadedFile(file.path)
      throw new DomainError('BAD_ID', { providedId: userId, message: CONST.BAD_ID })
    }

    const user = await this.usersRepo.getById(userId)
    if (!user) {
      await deleteUploadedFile(file.path)
      throw new DomainError('USER_NOT_FOUND', { searchedUser: userId, message: CONST.USER_NOT_FOUND })
    }

    if (documentType && !CONST.USER_DOCUMENT_TYPES.includes(documentType)) {
      await deleteUploadedFile(file.path)
      throw new DomainError('DOCUMENT_TYPE_INVALID', {
        provided: documentType,
        allowed: CONST.USER_DOCUMENT_TYPES
      })
    }

    let finalPath = file.path
    if (documentType === 'license') {
      finalPath = await moveUploadedFile(file.path, UPLOAD_PATHS.LICENSES_DIR, file.filename)
    }

    const metadata = {
      originalName: file.originalname,
      storedName: file.filename,
      path: path.relative(process.cwd(), finalPath),
      mimeType: file.mimetype,
      size: file.size,
      documentType: documentType || 'other',
      uploadedAt: new Date()
    }

    user.documents.push(metadata)
    await user.save()

    logger.info('Documento de usuario cargado correctamente', {
      userId,
      documentType: metadata.documentType,
      storedName: metadata.storedName
    })

    return {
      success: true,
      message: 'Documento cargado correctamente.',
      data: { userId, document: metadata }
    }
  }
}

export const usersService = new UsersService(usersRepository)