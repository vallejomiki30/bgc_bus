import express from 'express'
import { 
    getRoutes,
    addRoute,
    editRoute,
    deleteRoute,
} from '../controllers/busRouteController.js'
const router = express.Router()

router.get('/', getRoutes)
router.post('/add', addRoute)
router.post('/edit', editRoute)
router.delete('/delete',deleteRoute)

export default router