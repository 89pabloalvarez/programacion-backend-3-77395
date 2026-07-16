import { Router } from 'express'
import { productsService } from '../services/products.js'
import { cartsService } from '../services/carts.js'
import { CONSTANTS as CONST } from '../common/constants.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    let { page = 1, limit = 10, sort = '', query = '' } = req.query

    page  = parseInt(page)
    limit = parseInt(limit)

    if (isNaN(page)  || page  < 1) page  = 1
    if (isNaN(limit) || limit < 1) limit = 10
    if (limit > 100) limit = 100
    if (sort !== 'asc' && sort !== 'desc') sort = ''

    const result = await productsService.getAll({ page, limit, sort, query })

    if (page > result.totalPages && result.totalPages > 0) {
      return res.redirect(`/?page=${result.totalPages}&limit=${limit}&sort=${sort}&query=${query}`)
    }

    const products = (result.docs || []).map(p => ({
      ...p,
      status: p.status ? 'Si' : 'No'
    }))

    const buildLink = (p) =>
      p ? `/?page=${p}&limit=${limit}&sort=${sort}&query=${query}` : null

    res.render('pages/home', {
      page_title: 'Inicio',
      products,
      pagination: {
        page:        result.page,
        totalPages:  result.totalPages,
        totalDocs:   result.totalDocs,
        limit:       result.limit,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage:    result.prevPage,
        nextPage:    result.nextPage,
        prevLink:    buildLink(result.prevPage),
        nextLink:    buildLink(result.nextPage),
        isEmpty:     products.length === 0,
        sort,
        query
      }
    })
  } catch (error) {
    next(error)
  }
})

router.get('/realtimeproducts', (req, res) => {
  res.render('pages/realTimeProducts', { page_title: 'Productos en Tiempo Real' })
})

// Vista del carrito por ID: /cart/:cid
router.get('/cart/:cid', async (req, res, next) => {
  try {
    const { cid } = req.params
    const cart = await cartsService.getById(cid)

    const products = cart.products.map(item => ({
      product: item.product,
      quantity: item.quantity,
      subtotal: (item.product.price * item.quantity).toFixed(2)
    }))

    const total = products
      .reduce((acc, item) => acc + parseFloat(item.subtotal), 0)
      .toFixed(2)

    res.render('pages/cart', {
      page_title: 'Carrito',
      cartId: cid,
      emptyCart: products.length === 0,
      products,
      total
    })
  } catch (error) {
    if (error.statusCode === 400 || error.statusCode === 404) {
      return res.render('pages/cart', {
        page_title: 'Carrito',
        error: error.message
      })
    }
    next(error)
  }
})

export default router
