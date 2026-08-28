import { Router } from "express"
import { usersController } from "../controllers/users.js"
import { uploadUserDocument } from "../config/multer.js"

const router = Router()

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Obtener todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', usersController.getAll)

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obtener usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadIdError'
 *       404:
 *         $ref: '#/components/responses/UserNotFoundError'
 */
router.get('/:id', usersController.getById)

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Crear un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateInput'
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Falta la contraseña, o algún campo no cumple el esquema esperado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noPassword:
 *                 summary: Falta la contraseña
 *                 value: { status: 'error', code: 'USER_CREATE_NOT_PASSWORD', message: 'Se debe ingresar una contraseña al crear un usuario.', details: null }
 *               validation:
 *                 summary: Campos inválidos/faltantes
 *                 value: { status: 'error', code: 'VALIDATION_FAILED', message: 'Los datos enviados no son válidos.', details: { errors: ["Faltan campos: 'email'."] } }
 */
router.post('/', usersController.create)

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Actualizar un usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: ID inválido o campos que no cumplen el esquema esperado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/responses/UserNotFoundError'
 */
router.patch('/:id', usersController.update)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Eliminar un usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/UserNotFoundError'
 */
router.delete('/:id', usersController.delete)

/**
 * @swagger
 * /users/{id}/documents:
 *   post:
 *     tags: [Users]
 *     summary: Subir un documento de usuario (DNI, licencia, comprobante de domicilio, etc.)
 *     description: >
 *       Sube un archivo asociado a un usuario existente. Se guarda en el filesystem
 *       del servidor (uploads/users, o uploads/licenses si documentType es 'license')
 *       y se registran sus metadatos en el usuario (nunca el archivo en sí en la base).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario al que se asocia el documento.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Archivo a subir. Tipos permitidos - PDF, JPG, PNG. Tamaño máximo - 5MB.
 *               documentType:
 *                 type: string
 *                 enum: [dni, license, proof_of_address, other]
 *                 description: Tipo de documento (opcional; si no se envía se guarda como 'other').
 *             required: [document]
 *     responses:
 *       201:
 *         description: Documento cargado y asociado correctamente al usuario.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: 'Documento cargado correctamente.'
 *               data:
 *                 userId: '64f1a2b3c4d5e6f7a8b9c0d1'
 *                 document:
 *                   originalName: 'dni-frente.jpg'
 *                   storedName: '1730000000000-9c1b2a3d.jpg'
 *                   path: 'uploads/users/1730000000000-9c1b2a3d.jpg'
 *                   mimeType: 'image/jpeg'
 *                   size: 204800
 *                   documentType: 'dni'
 *                   uploadedAt: '2025-01-01T00:00:00.000Z'
 *       400:
 *         description: Falta el archivo, tipo/tamaño no permitido, campo incorrecto, tipo de documento inválido, o ID mal formado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               fileRequired:
 *                 summary: No se envió ningún archivo
 *                 value: { status: 'error', code: 'FILE_REQUIRED', message: 'Se debe adjuntar un archivo.', details: null }
 *               fileTypeNotAllowed:
 *                 summary: Tipo de archivo no permitido
 *                 value: { status: 'error', code: 'FILE_TYPE_NOT_ALLOWED', message: 'El tipo de archivo no está permitido.', details: { providedMimeType: 'application/zip' } }
 *               fileTooLarge:
 *                 summary: El archivo supera el tamaño máximo
 *                 value: { status: 'error', code: 'FILE_TOO_LARGE', message: 'El archivo supera el tamaño máximo permitido.', details: { multerCode: 'LIMIT_FILE_SIZE' } }
 *               invalidFieldName:
 *                 summary: El campo del archivo no es 'document'
 *                 value: { status: 'error', code: 'INVALID_FIELD_NAME', message: 'El campo del archivo enviado no coincide con el esperado.', details: { multerCode: 'LIMIT_UNEXPECTED_FILE' } }
 *               documentTypeInvalid:
 *                 summary: documentType fuera de los valores permitidos
 *                 value: { status: 'error', code: 'DOCUMENT_TYPE_INVALID', message: 'El tipo de documento no es válido.', details: { provided: 'foo' } }
 *       404:
 *         $ref: '#/components/responses/UserNotFoundError'
 */
router.post('/:id/documents', uploadUserDocument.single('document'), usersController.uploadDocument)

export default router
