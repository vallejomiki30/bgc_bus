import express from 'express'
import { 
    getETA,
    driveCompute,
} from '../controllers/driveRouteComputationController.js'
const router = express.Router()

router.post('/user',getETA)
router.post('/compute', driveCompute)

export default router