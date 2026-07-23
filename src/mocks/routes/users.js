import { Router } from 'express'
import { getMockUsers, insertMockUsers } from '../controllers/users.js'

const router = Router()

router.get('/get', getMockUsers)
router.post('/insert', insertMockUsers)

export default router