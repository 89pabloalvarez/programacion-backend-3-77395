import { expect } from 'chai'
import request from 'supertest'
import app from '../src/config/app.js'

describe('Logger - /api/logger/test', () => {
  it('genera logs de prueba en todos los niveles y responde 200', async () => {
    const res = await request(app).get('/api/logger/test')

    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('success', true)
    expect(res.body).to.have.property('message')
    expect(res.body.message).to.be.a('string')
  })
})
