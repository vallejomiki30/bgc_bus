import express from 'express'
import { 
    getStations,
    addStation,
    editStation,
    deleteStation,
} from '../controllers/busStationController.js'
const router = express.Router()

router.get('/', getStations)
router.post('/add', addStation)
router.post('/edit', editStation)
router.delete('/delete', deleteStation)

export default router