import express from 'express'
import { getTestData } from '../controllers/testController.js'
const router = express.Router()

router.get('/', getTestData)
// router.post('/test/postData', postTestData)

export default router