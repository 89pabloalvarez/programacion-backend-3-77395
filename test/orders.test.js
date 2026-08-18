import { expect } from 'chai'
import request from 'supertest'
import mongoose from 'mongoose'
import app from '../src/config/app.js'
import { createTestProduct, deleteProductsByIds, deleteCartsByIds } from './helpers/testData.js'

describe('Pedidos - /api/carts', () => {
  const createdProductIds = []
  const createdCartIds = []
  let product

  before(async () => {
    product = await createTestProduct()
    createdProductIds.push(product._id.toString())
  })

  after(async () => {
    await deleteCartsByIds(createdCartIds)
    await deleteProductsByIds(createdProductIds)
  })

  describe('GET /api/carts', () => {
    it('devuelve 200 con un listado paginado de pedidos', async () => {
      const res = await request(app).get('/api/carts')

      expect(res.status).to.equal(200)
      expect(res.body).to.have.property('docs')
      expect(res.body.docs).to.be.an('array')
    })
  })

  describe('POST /api/carts', () => {
    it('crea un pedido con datos válidos (201)', async () => {
      const res = await request(app)
        .post('/api/carts')
        .send([{ productId: product._id.toString(), quantity: 2 }])

      expect(res.status).to.equal(201)
      expect(res.body.success).to.equal(true)
      expect(res.body).to.have.property('cart')
      expect(res.body.cart).to.have.property('_id')
      expect(res.body.cart.products).to.have.lengthOf(1)
      expect(res.body.cart.products[0].quantity).to.equal(2)

      createdCartIds.push(res.body.cart._id)
    })

    it('rechaza un body que no es un array (400 PRODUCT_CREATE_MUST_BE_ARRAY)', async () => {
      const res = await request(app)
        .post('/api/carts')
        .send({ productId: product._id.toString(), quantity: 1 })

      expect(res.status).to.equal(400)
      expect(res.body.status).to.equal('error')
      expect(res.body.code).to.equal('PRODUCT_CREATE_MUST_BE_ARRAY')
    })

    it('rechaza items con cantidad inválida (400 VALIDATION_FAILED)', async () => {
      const res = await request(app)
        .post('/api/carts')
        .send([{ productId: product._id.toString(), quantity: -1 }])

      expect(res.status).to.equal(400)
      expect(res.body.code).to.equal('VALIDATION_FAILED')
      expect(res.body.details).to.have.property('errors')
    })

    it('rechaza un pedido con un producto inexistente (400 VALIDATION_FAILED)', async () => {
      const fakeProductId = new mongoose.Types.ObjectId().toString()
      const res = await request(app)
        .post('/api/carts')
        .send([{ productId: fakeProductId, quantity: 1 }])

      expect(res.status).to.equal(400)
      expect(res.body.code).to.equal('VALIDATION_FAILED')
    })
  })

  describe('GET /api/carts/:id', () => {
    let cartId

    before(async () => {
      const res = await request(app)
        .post('/api/carts')
        .send([{ productId: product._id.toString(), quantity: 1 }])
      cartId = res.body.cart._id
      createdCartIds.push(cartId)
    })

    it('obtiene un pedido existente por id (200)', async () => {
      const res = await request(app).get(`/api/carts/${cartId}`)

      expect(res.status).to.equal(200)
      expect(res.body._id).to.equal(cartId)
      expect(res.body.products).to.be.an('array')
      expect(res.body).to.have.property('state')
    })

    it('devuelve 400 BAD_ID con un id mal formado', async () => {
      const res = await request(app).get('/api/carts/no-es-un-id')

      expect(res.status).to.equal(400)
      expect(res.body.code).to.equal('BAD_ID')
    })

    it('devuelve 404 PURCHASE_NOT_FOUND con un id válido pero inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      const res = await request(app).get(`/api/carts/${fakeId}`)

      expect(res.status).to.equal(404)
      expect(res.body.code).to.equal('PURCHASE_NOT_FOUND')
    })
  })
})
