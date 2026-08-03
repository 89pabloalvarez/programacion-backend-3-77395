import { productsService } from '../services/products.js'
import logger from '../config/logger.js'

export default function registerProductSockets(io) {
  io.on('connection', async (socket) => {
    logger.info('Usuario conectado al socket', { socketId: socket.id })

    let socketPage = 1
    let socketLimit = 10
    let socketSort = ''

    const emitProducts = async () => {
      const products = await productsService.getAll({
        page: socketPage,
        limit: socketLimit,
        sort: socketSort
      })
      socket.emit('updateProducts', products)
    }

    await emitProducts()

    socket.on('getProducts', async ({ page, limit, sort }) => {
      try {
        socketPage = page ?? socketPage
        socketLimit = limit ?? socketLimit
        socketSort = sort ?? socketSort
        await emitProducts()
      } catch (error) {
        socket.emit('error', { message: error.message })
      }
    })

    socket.on('addProduct', async (body) => {
      try {
        await productsService.create(body)
        socketPage = 1
        io.emit('updateProducts', await productsService.getAll({
          page: socketPage,
          limit: socketLimit,
          sort: socketSort
        }))
      } catch (error) {
        socket.emit('error', { message: error.message })
      }
    })

    socket.on('deleteProduct', async (productToDelete) => {
      try {
        await productsService.delete(productToDelete)
        const check = await productsService.getAll({
          page: socketPage,
          limit: socketLimit,
          sort: socketSort
        })
        if (check.docs.length === 0 && socketPage > 1) socketPage--

        io.emit('updateProducts', await productsService.getAll({
          page: socketPage,
          limit: socketLimit,
          sort: socketSort
        }))
      } catch (error) {
        socket.emit('error', { message: error.message })
      }
    })

    socket.on('disconnect', () => {
      logger.info('Usuario desconectado del socket', { socketId: socket.id })
    })
  })
}