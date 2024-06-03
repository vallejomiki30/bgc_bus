import express from 'express'
import { 
    driveCompute,
} from '../controllers/driveRouteComputationController.js'
const router = express.Router()

router.post('/compute', driveCompute)

export default router