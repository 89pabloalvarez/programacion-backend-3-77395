import { expect } from 'chai'
import request from 'supertest'
import mongoose from 'mongoose'
import app from '../src/config/app.js'
import { UserModel } from '../src/models/user.js'
import { DeliveryModel } from '../src/models/delivery.js'
import {
  createTestUser,
  deleteUsersByIds,
  createTestDelivery,
  deleteDeliveriesByIds,
  deleteCartsByIds,
  deleteProductsByIds,
  deleteUploadedFilesByRelativePaths
} from './helpers/testData.js'

const fakePdf = Buffer.from('%PDF-1.4 contenido de prueba, no es un pdf real')

describe('Carga de archivos - /api/users/:id/documents', () => {
  let user
  const createdUserIds = []
  const uploadedFilePaths = []

  before(async () => {
    user = await createTestUser()
    createdUserIds.push(user._id.toString())
  })

  after(async () => {
    await deleteUploadedFilesByRelativePaths(uploadedFilePaths)
    await deleteUsersByIds(createdUserIds)
  })

  it('carga un documento válido y lo asocia al usuario (201)', async () => {
    const res = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .attach('document', fakePdf, { filename: 'dni-frente.pdf', contentType: 'application/pdf' })
      .field('documentType', 'dni')

    expect(res.status).to.equal(201)
    expect(res.body.success).to.equal(true)
    expect(res.body.data).to.have.property('userId', user._id.toString())

    const doc = res.body.data.document
    expect(doc).to.have.property('originalName', 'dni-frente.pdf')
    expect(doc).to.have.property('storedName')
    expect(doc).to.have.property('path')
    expect(doc.mimeType).to.equal('application/pdf')
    expect(doc.documentType).to.equal('dni')
    expect(doc.size).to.be.a('number').greaterThan(0)

    uploadedFilePaths.push(doc.path)

    // se verifica que el metadato haya quedado persistido en el usuario
    const updatedUser = await UserModel.findById(user._id)
    expect(updatedUser.documents).to.have.lengthOf(1)
    expect(updatedUser.documents[0].originalName).to.equal('dni-frente.pdf')
  })

  it('mueve el archivo a la subcarpeta de licencias cuando documentType es "license"', async () => {
    const res = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .attach('document', fakePdf, { filename: 'licencia.pdf', contentType: 'application/pdf' })
      .field('documentType', 'license')

    expect(res.status).to.equal(201)
    expect(res.body.data.document.documentType).to.equal('license')
    expect(res.body.data.document.path).to.include('licenses')

    uploadedFilePaths.push(res.body.data.document.path)
  })

  it('rechaza la carga sin archivo (400 FILE_REQUIRED)', async () => {
    const res = await request(app).post(`/api/users/${user._id}/documents`)

    expect(res.status).to.equal(400)
    expect(res.body.status).to.equal('error')
    expect(res.body.code).to.equal('FILE_REQUIRED')
  })

  it('rechaza un tipo de documento inválido (400 DOCUMENT_TYPE_INVALID)', async () => {
    const res = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .attach('document', fakePdf, { filename: 'doc.pdf', contentType: 'application/pdf' })
      .field('documentType', 'tipo-que-no-existe')

    expect(res.status).to.equal(400)
    expect(res.body.code).to.equal('DOCUMENT_TYPE_INVALID')
  })

  it('rechaza un tipo de archivo no permitido (400 FILE_TYPE_NOT_ALLOWED)', async () => {
    const res = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .attach('document', Buffer.from('contenido cualquiera'), { filename: 'archivo.zip', contentType: 'application/zip' })

    expect(res.status).to.equal(400)
    expect(res.body.code).to.equal('FILE_TYPE_NOT_ALLOWED')
  })

  it('rechaza un id de usuario mal formado (400 BAD_ID)', async () => {
    const res = await request(app)
      .post('/api/users/id-invalido/documents')
      .attach('document', fakePdf, { filename: 'doc.pdf', contentType: 'application/pdf' })

    expect(res.status).to.equal(400)
    expect(res.body.code).to.equal('BAD_ID')
  })

  it('devuelve 404 USER_NOT_FOUND si el usuario no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId()
    const res = await request(app)
      .post(`/api/users/${fakeId}/documents`)
      .attach('document', fakePdf, { filename: 'doc.pdf', contentType: 'application/pdf' })

    expect(res.status).to.equal(404)
    expect(res.body.code).to.equal('USER_NOT_FOUND')
  })
})

describe('Carga de archivos - /api/delivery/:id/receipt', () => {
  let delivery, product, cart, deliveryMan
  const uploadedFilePaths = []

  before(async () => {
    ({ delivery, product, cart, deliveryMan } = await createTestDelivery())
  })

  after(async () => {
    await deleteUploadedFilesByRelativePaths(uploadedFilePaths)
    await deleteDeliveriesByIds([delivery._id])
    await deleteCartsByIds([cart._id])
    await deleteProductsByIds([product._id])
    await deleteUsersByIds([deliveryMan._id])
  })

  it('carga un comprobante válido y lo asocia a la entrega (201)', async () => {
    const res = await request(app)
      .post(`/api/delivery/${delivery._id}/receipt`)
      .attach('receipt', fakePdf, { filename: 'comprobante.pdf', contentType: 'application/pdf' })
      .field('documentType', 'signature')

    expect(res.status).to.equal(201)
    expect(res.body.success).to.equal(true)
    expect(res.body.data).to.have.property('deliveryId', delivery._id.toString())

    const receipt = res.body.data.receipt
    expect(receipt).to.have.property('originalName', 'comprobante.pdf')
    expect(receipt.documentType).to.equal('signature')

    uploadedFilePaths.push(receipt.path)

    const updatedDelivery = await DeliveryModel.findById(delivery._id)
    expect(updatedDelivery.receipts).to.have.lengthOf(1)
  })

  it('rechaza la carga sin archivo (400 FILE_REQUIRED)', async () => {
    const res = await request(app).post(`/api/delivery/${delivery._id}/receipt`)

    expect(res.status).to.equal(400)
    expect(res.body.code).to.equal('FILE_REQUIRED')
  })

  it('devuelve 404 PURCHASE_NOT_FOUND si la entrega no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId()
    const res = await request(app)
      .post(`/api/delivery/${fakeId}/receipt`)
      .attach('receipt', fakePdf, { filename: 'comprobante.pdf', contentType: 'application/pdf' })

    expect(res.status).to.equal(404)
    expect(res.body.code).to.equal('PURCHASE_NOT_FOUND')
  })
})
