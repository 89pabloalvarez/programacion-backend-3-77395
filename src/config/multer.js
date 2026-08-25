import multer from 'multer'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { CONSTANTS as CONST } from '../common/constants.js'
import { DomainError } from '../common/errors.js'
import logger from './logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const UPLOADS_ROOT = path.resolve(__dirname, '../../uploads')
const USER_DOCS_DIR = path.join(UPLOADS_ROOT, 'users')
const LICENSES_DIR = path.join(UPLOADS_ROOT, 'licenses')
const DELIVERY_RECEIPTS_DIR = path.join(UPLOADS_ROOT, 'deliveries')

export const UPLOAD_PATHS = { UPLOADS_ROOT, USER_DOCS_DIR, LICENSES_DIR, DELIVERY_RECEIPTS_DIR }

for (const dir of [USER_DOCS_DIR, LICENSES_DIR, DELIVERY_RECEIPTS_DIR]) {
  fs.mkdirSync(dir, { recursive: true })
}

const filenameGenerator = (req, file, cb) => {
  const uniqueSuffix = `${Date.now()}-${crypto.randomUUID()}`
  const ext = path.extname(file.originalname)
  cb(null, `${uniqueSuffix}${ext}`)
}

const buildStorage = (destination) => multer.diskStorage({
  destination: (req, file, cb) => cb(null, destination),
  filename: filenameGenerator
})

const fileFilter = (req, file, cb) => {
  if (!CONST.UPLOAD_ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    logger.warning('Intento de carga con tipo de archivo no permitido', {
      mimetype: file.mimetype,
      originalname: file.originalname
    })
    return cb(new DomainError('FILE_TYPE_NOT_ALLOWED', {
      providedMimeType: file.mimetype,
      allowedMimeTypes: CONST.UPLOAD_ALLOWED_MIME_TYPES
    }))
  }
  cb(null, true)
}

const limits = { fileSize: CONST.UPLOAD_MAX_FILE_SIZE_BYTES }

export const uploadUserDocument = multer({
  storage: buildStorage(USER_DOCS_DIR),
  fileFilter,
  limits
})

export const uploadDeliveryReceipt = multer({
  storage: buildStorage(DELIVERY_RECEIPTS_DIR),
  fileFilter,
  limits
})

export const deleteUploadedFile = async (filePath) => {
  if (!filePath) return
  try {
    await fs.promises.unlink(filePath)
  } catch (error) {
    logger.warning('No se pudo eliminar un archivo temporal tras un error de validación', {
      filePath,
      error: error.message
    })
  }
}

export const moveUploadedFile = async (currentPath, targetDir, filename) => {
  const targetPath = path.join(targetDir, filename)
  try {
    await fs.promises.rename(currentPath, targetPath)
    return targetPath
  } catch (error) {
    logger.error('Error al mover el archivo cargado a su carpeta final', {
      currentPath,
      targetDir,
      error: error.message
    })
    throw new DomainError('FILE_SAVE_ERROR', { originalError: error.message })
  }
}