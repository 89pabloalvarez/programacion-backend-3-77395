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
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            last_name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'array', items: { type: 'string' } },
            status: { type: 'boolean' }
          },
          required: ['name', 'last_name', 'email', 'role'],
          example: { _id: '64f...', name: 'Pablo', last_name: 'Alvarez', email: 'pablo@example.com', role: ['user'], status: true }
        },
        OrderItem: {
          type: 'object',
          properties: {
            product: {
              type: 'object',
              properties: { _id: { type: 'string' }, title: { type: 'string' }, price: { type: 'number' } }
            },
            quantity: { type: 'integer' },
            price: { type: 'number' }
          },
          required: ['product', 'quantity']
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            products: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
            user: { $ref: '#/components/schemas/User' },
            state: { type: 'string', enum: ['pending', 'confirmed', 'shipped', 'delivered'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] }
          },
          required: ['products', 'user']
        },
        Delivery: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            order: { type: 'string' },
            deliveryMan: { $ref: '#/components/schemas/User' },
            date: { type: 'string', format: 'date-time' }
          },
          required: ['order', 'deliveryMan']
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            code: { type: 'string' },
            message: { type: 'string' },
            details: { type: ['object', 'array', 'null'] }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: ['object', 'array', 'null'] }
          }
        }
      },
    }
  },
  apis: ['./src/routes/*.js', './src/mocks/routes/*.js']
}

export const swaggerSpec = swaggerJsdoc(options)