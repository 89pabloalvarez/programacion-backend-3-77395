import { Router } from 'express'
import { getMockDeliveries, insertMockDeliveries } from '../controllers/delivery.js'

const router = Router()

router.get('/get', getMockDeliveries)
router.post('/insert', insertMockDeliveries)

export default router