import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

import { notFound,errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
connectDB()

const port = process.env.PORT || 9000

import testRoute from './routes/testRoute.js'
import userRoute from './routes/userRoute.js'
import busRoute from './routes/busRoute.js'
import busStation from './routes/busStation.js'
import walkRouteComputation  from './routes/walkRouteComputation.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
// }));

app.use('/api_v1/test', testRoute)
app.use('/api_v1/user', userRoute)
app.use('/api_v1/route', busRoute)
app.use('/api_v1/station', busStation)
app.use('/api_v1/walk', walkRouteComputation)

app.get('/', (req,res) => res.send('Server is running.'))

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`Started on port ${port}`))
