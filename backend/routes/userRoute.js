import express from 'express'
import { 
    addUser,
    authUser,
} from '../controllers/userController.js'
const router = express.Router()

router.post('/auth',authUser)
router.post('/add', addUser)

export default router