import { expect } from 'chai'
import request from 'supertest'
import mongoose from 'mongoose'
import app from '../src/config/app.js'
import { createTestUser, buildUserPayload, deleteUsersByIds } from './helpers/testData.js'

describe('Usuarios - /api/users', () => {
  const createdUserIds = []

  after(async () => {
    await deleteUsersByIds(createdUserIds)
  })

  describe('GET /api/users', () => {
    it('devuelve 200 con un listado paginado', async () => {
      const res = await request(app).get('/api/users')

      expect(res.status).to.equal(200)
      expect(res.body).to.have.property('docs')
      expect(res.body.docs).to.be.an('array')
      expect(res.body).to.have.property('totalDocs')
      expect(res.body).to.have.property('page')
    })
  })

  describe('POST /api/users', () => {
    it('crea un usuario con datos válidos (201)', async () => {
      const payload = buildUserPayload()
      const res = await request(app).post('/api/users').send(payload)

      expect(res.status).to.equal(201)
      expect(res.body).to.have.property('_id')
      expect(res.body.name).to.equal(payload.name)
      expect(res.body.email).to.equal(payload.email)

      createdUserIds.push(res.body._id)
    })

    it('rechaza la creación sin password (400 USER_CREATE_NOT_PASSWORD)', async () => {
      const payload = buildUserPayload()
      delete payload.password

      const res = await request(app).post('/api/users').send(payload)

      expect(res.status).to.equal(400)
      expect(res.body.status).to.equal('error')
      expect(res.body.code).to.equal('USER_CREATE_NOT_PASSWORD')
      expect(res.body).to.have.property('message')
    })

    it('rechaza la creación con un campo de tipo inválido (400 VALIDATION_FAILED)', async () => {
      const payload = buildUserPayload({ role: 'no-deberia-ser-string' })

      const res = await request(app).post('/api/users').send(payload)

      expect(res.status).to.equal(400)
      expect(res.body.code).to.equal('VALIDATION_FAILED')
      expect(res.body.details).to.not.be.null
    })
  })

  describe('GET /api/users/:id', () => {
    let user

    before(async () => {
      user = await createTestUser()
      createdUserIds.push(user._id.toString())
    })

    it('obtiene un usuario existente por id (200)', async () => {
      const res = await request(app).get(`/api/users/${user._id}`)

      expect(res.status).to.equal(200)
      expect(res.body._id).to.equal(user._id.toString())
      expect(res.body.email).to.equal(user.email)
    })

    it('devuelve 400 BAD_ID con un id mal formado', async () => {
      const res = await request(app).get('/api/users/id-invalido')

      expect(res.status).to.equal(400)
      expect(res.body.status).to.equal('error')
      expect(res.body.code).to.equal('BAD_ID')
    })

    it('devuelve 404 USER_NOT_FOUND con un id válido pero inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      const res = await request(app).get(`/api/users/${fakeId}`)

      expect(res.status).to.equal(404)
      expect(res.body.status).to.equal('error')
      expect(res.body.code).to.equal('USER_NOT_FOUND')
    })
  })
})
