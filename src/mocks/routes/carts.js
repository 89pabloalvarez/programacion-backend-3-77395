import { Router } from 'express'
import { getMockCarts, insertMockCarts } from '../controllers/carts.js'

const router = Router()

router.get('/get', getMockCarts)
router.post('/insert', insertMockCarts)

export default router