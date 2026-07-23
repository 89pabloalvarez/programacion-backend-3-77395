import { Router } from 'express'
import { getMockProducts, insertMockProducts } from '../controllers/products.js'

const router = Router()

router.get('/get', getMockProducts)
router.post('/insert', insertMockProducts)

export default router