import express from 'express'
import { 
    getRoutes,
    addRoute,
} from '../controllers/busRouteController.js'
const router = express.Router()

router.get('/', getRoutes)
router.post('/add', addRoute)

export default router