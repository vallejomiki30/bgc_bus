import express from 'express'
import { 
    walkCompute,
} from '../controllers/walkRouteComputationController.js'
const router = express.Router()

router.post('/compute', walkCompute)

export default router