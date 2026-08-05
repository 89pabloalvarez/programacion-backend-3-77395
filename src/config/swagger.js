import { CONSTANT as CONST } from './constants.js'
import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShipNow API',
      version: '1.0.0',
      description: 'API de gestión de pedidos y entregas...'
    },
    servers: [{ url: `${CONST.BASEURL}/api`, description: 'Servidor local' }],
    tags: [
      { name: 'Users' }, { name: 'Orders' }, { name: 'Deliveries' },
      { name: 'Mocks' }, { name: 'Logger' }
    ],
    components: {
      schemas: {},
    }
  },
  apis: ['./src/routes/*.js', './src/mocks/routes/*.js']
}

export const swaggerSpec = swaggerJsdoc(options)