import express from 'express'
import { 
    getUser,
    allUser,
    addUser,
    authUser,
    editUser,
} from '../controllers/userController.js'
const router = express.Router()

router.get('/', getUser)
router.get('/all',allUser)
router.post('/auth',authUser)
router.post('/add', addUser)
router.put('/edit', editUser)

export default router