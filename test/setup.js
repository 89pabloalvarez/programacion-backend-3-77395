import mongoose from 'mongoose'
import mongoConnection from '../src/config/mongo.js'

export const mochaHooks = {
  async beforeAll() {
    this.timeout(20000)
    await mongoConnection()

    if (mongoose.connection.readyState !== 1) {
      throw new Error(
        'No se pudo conectar a la base de datos de testing. Verificá las variables ' +
        'de entorno en tu archivo .env.test (ver .env.test.example).'
      )
    }
  },

  async afterAll() {
    this.timeout(20000)
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase()
      await mongoose.disconnect()
    }
  }
}
