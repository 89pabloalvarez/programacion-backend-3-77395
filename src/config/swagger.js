import { CONSTANTS as CONST } from '../common/constants.js'
import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShipNow API',
      version: '1.0.0',
      description: 'API REST para la gestión de pedidos(carts), productos, usuarios y entregas de ShipNow, con generación de datos de prueba (mocks).'
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
        },
        CartItemInput: {
          type: 'object',
          description: 'Item enviado al crear/reemplazar productos de un pedido.',
          properties: {
            productId: { type: 'string' },
            quantity: { type: 'number' }
          },
          required: ['productId', 'quantity'],
          example: { productId: '64f1a2b3c4d5e6f7a8b9c0d1', quantity: 2 }
        },
        UserCreateInput: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            last_name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            status: { type: 'boolean' },
            role: { type: 'array', items: { type: 'string' } }
          },
          required: ['name', 'last_name', 'email', 'password'],
          example: { name: 'Pablo', last_name: 'Alvarez', email: 'pablo@example.com', password: 'secreto123', role: ['user'] }
        },
        DeliveryCreateInput: {
          type: 'object',
          description: 'IDs del pedido y del repartidor a asociar.',
          properties: {
            order: { type: 'string', description: 'ID del carrito/pedido (Cart)' },
            deliveryMan: { type: 'string', description: 'ID del usuario repartidor' }
          },
          required: ['order', 'deliveryMan'],
          example: { order: '64f1a2b3c4d5e6f7a8b9c0d1', deliveryMan: '64f1a2b3c4d5e6f7a8b9c0d2' }
        }
      },
      responses: {
        BadIdError: {
          description: 'El ID enviado no tiene un formato de ObjectId válido.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { status: 'error', code: 'BAD_ID', message: 'El ID no tiene un formato válido.', details: { providedId: 'abc123' } }
            }
          }
        },
        UserNotFoundError: {
          description: 'No existe un usuario con ese ID.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { status: 'error', code: 'USER_NOT_FOUND', message: 'Usuario no encontrado.', details: { searchedUser: '64f...' } }
            }
          }
        },
        ProductNotFoundError: {
          description: 'No existe un producto con ese ID.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { status: 'error', code: 'PRODUCT_NOT_FOUND', message: 'Producto no encontrado.', details: { searchedProduct: '64f...' } }
            }
          }
        },
        PurchaseNotFoundError: {
          description: 'No existe el pedido (carrito) o la entrega buscada.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { status: 'error', code: 'PURCHASE_NOT_FOUND', message: 'Recurso no encontrado.', details: { searchedCart: '64f...' } }
            }
          }
        },
        ValidationFailedError: {
          description: 'Los campos enviados no cumplen con el esquema esperado (faltantes, tipo incorrecto o valor inválido, ej. un estado/prioridad fuera de los permitidos).',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { status: 'error', code: 'VALIDATION_FAILED', message: 'Los datos enviados no son válidos.', details: { errors: ['Faltan campos: \'email\'.'] } }
            }
          }
        },
        RequestNotCompleteError: {
          description: 'Falta un campo obligatorio en el body.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { status: 'error', code: 'REQUEST_NOT_COMPLETE', message: 'Solicitud incompleta.', details: { body: 'No definido' } }
            }
          }
        },
        QuantityInvalidError: {
          description: 'La cantidad enviada no es un número válido (negativa, cero o no numérica).',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { status: 'error', code: 'QUANTITY_INVALID_VALUE', message: 'La cantidad indicada no es válida.', details: { quantity: -1 } }
            }
          }
        },
        ProductArrayRequiredError: {
          description: 'El body debe ser un array de items { productId, quantity }.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { status: 'error', code: 'PRODUCT_CREATE_MUST_BE_ARRAY', message: 'El body debe ser un array.', details: null }
            }
          }
        },
        UserPasswordRequiredError: {
          description: 'Falta la contraseña al crear un usuario.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { status: 'error', code: 'USER_CREATE_NOT_PASSWORD', message: 'Se debe ingresar una contraseña al crear un usuario.', details: null }
            }
          }
        },
        MockQuantityInvalidError: {
          description: 'El query param "quantity" no es un entero positivo válido.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { status: 'error', code: 'MOCK_QUANTITY_INVALID', message: 'La cantidad de datos de prueba solicitada no es válida.', details: { provided: '-5' } }
            }
          }
        },
        MockInsertFailedError: {
          description: 'Falló la inserción de los datos de prueba en MongoDB.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { status: 'error', code: 'MOCK_INSERT_FAILED', message: 'Ocurrió un error al insertar los datos de prueba en MongoDB.', details: { originalError: '...' } }
            }
          }
        },
        MocksNoProductsError: {
          description: 'No hay productos cargados en la base para poder generar carritos/pedidos mock.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { status: 'error', code: 'MOCKS_NO_PRODUCTS', message: 'No hay productos disponibles para generar carritos mock.', details: null }
            }
          }
        },
        ServerError: {
          description: 'Error interno inesperado del servidor.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { status: 'error', code: 'SERVER_ERROR', message: 'Error interno del servidor.', details: null }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/mocks/routes/*.js']
}

export const swaggerSpec = swaggerJsdoc(options)