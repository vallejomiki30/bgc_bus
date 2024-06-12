import express from 'express'
import { 
    getDriver,
    allDriver,
    addDriver,
    authDriver,
    editDriver,
    deleteDriver,
} from '../controllers/driverController.js'
const router = express.Router()

router.get('/', getDriver)
router.get('/all',allDriver)
router.post('/auth',authDriver)
router.post('/add', addDriver)
router.put('/edit', editDriver)
router.delete('/delete', deleteDriver)

export default router