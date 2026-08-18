import { expect } from 'chai'
import request from 'supertest'
import app from '../src/config/app.js'
import { UserModel } from '../src/models/user.js'
import { ProductModel } from '../src/models/product.js'
import { CartModel } from '../src/models/cart.js'
import { createTestProduct } from './helpers/testData.js'

describe('Mocks - /api/mocks', () => {
  describe('Usuarios (/api/mocks/users)', () => {
    it('GET /get genera usuarios simulados sin persistirlos (200)', async () => {
      const beforeCount = await UserModel.countDocuments()

      const res = await request(app).get('/api/mocks/users/get?quantity=4')

      expect(res.status).to.equal(200)
      expect(res.body).to.be.an('array').with.lengthOf(4)
      expect(res.body[0]).to.have.property('email')
      expect(res.body[0]).to.have.property('name')

      const afterCount = await UserModel.countDocuments()
      expect(afterCount).to.equal(beforeCount)
    })

    it('GET /get con quantity inválida devuelve 400 MOCK_QUANTITY_INVALID', async () => {
      const res = await request(app).get('/api/mocks/users/get?quantity=-2')

      expect(res.status).to.equal(400)
      expect(res.body.status).to.equal('error')
      expect(res.body.code).to.equal('MOCK_QUANTITY_INVALID')
    })

    it('POST /insert genera y persiste usuarios simulados (200)', async () => {
      const idsBefore = (await UserModel.find().select('_id')).map(u => u._id.toString())

      const res = await request(app).post('/api/mocks/users/insert?quantity=3')

      expect(res.status).to.equal(200)
      expect(res.body.insertedQuantity).to.equal(3)

      const idsAfter = (await UserModel.find().select('_id')).map(u => u._id.toString())
      const newIds = idsAfter.filter(id => !idsBefore.includes(id))
      expect(newIds).to.have.lengthOf(3)

      await UserModel.deleteMany({ _id: { $in: newIds } })
    })

    it('POST /insert con quantity inválida devuelve 400 MOCK_QUANTITY_INVALID', async () => {
      const res = await request(app).post('/api/mocks/users/insert?quantity=abc')

      expect(res.status).to.equal(400)
      expect(res.body.code).to.equal('MOCK_QUANTITY_INVALID')
    })
  })

  describe('Pedidos (/api/mocks/carts)', () => {
    it('POST /insert devuelve 500 MOCKS_NO_PRODUCTS si no hay productos cargados', async () => {
      await ProductModel.deleteMany({})

      const res = await request(app).post('/api/mocks/carts/insert?quantity=2')

      expect(res.status).to.equal(500)
      expect(res.body.status).to.equal('error')
      expect(res.body.code).to.equal('MOCKS_NO_PRODUCTS')
    })

    it('POST /insert genera y persiste pedidos simulados cuando hay productos (200)', async () => {
      const product = await createTestProduct()
      const idsBefore = (await CartModel.find().select('_id')).map(c => c._id.toString())

      const res = await request(app).post('/api/mocks/carts/insert?quantity=2')

      expect(res.status).to.equal(200)
      expect(res.body.insertedCount).to.equal(2)

      const idsAfter = (await CartModel.find().select('_id')).map(c => c._id.toString())
      const newIds = idsAfter.filter(id => !idsBefore.includes(id))
      expect(newIds).to.have.lengthOf(2)

      await CartModel.deleteMany({ _id: { $in: newIds } })
      await ProductModel.findByIdAndDelete(product._id)
    })
  })
})
