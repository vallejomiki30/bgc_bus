import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import Users from '../models/user.js'

const protect = asyncHandler(async (req,res,next) => {
    let token
    token = req.cookies.bgc

    if (token) {
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await Users.find({id: decoded.id}).select('-invisible')
            next()
        }
        catch(error){
            res.status(401)
            throw new Error ('Session expired please relogin')
        }
    }
    else {
        res.status(401)
        throw new Error('Session expired please relogin')
    }
})

export { protect }