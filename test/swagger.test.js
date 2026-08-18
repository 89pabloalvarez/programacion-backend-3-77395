import { expect } from 'chai'
import request from 'supertest'
import app from '../src/config/app.js'

describe('Documentación - /api/docs', () => {
  it('la interfaz de Swagger responde 200 en HTML', async () => {
    const res = await request(app).get('/api/docs/')

    expect(res.status).to.equal(200)
    expect(res.headers['content-type']).to.include('text/html')
  })
})

describe('Rutas inexistentes', () => {
  it('devuelve 404 ROUTE_NOT_FOUND con el formato de error del módulo de errores', async () => {
    const res = await request(app).get('/api/esta-ruta-no-existe')

    expect(res.status).to.equal(404)
    expect(res.body.status).to.equal('error')
    expect(res.body.code).to.equal('ROUTE_NOT_FOUND')
    expect(res.body).to.have.property('message')
    expect(res.body).to.have.property('details')
  })
})
