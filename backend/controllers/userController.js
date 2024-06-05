import crypto from 'crypto'
import asyncHandler from 'express-async-handler'
import Sequence from '../models/sequence.js'
import Users from '../models/user.js'
import generateToken from '../util/generateToken.js'

const getUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    const user = await Users.findOne({id})

    if (user) {
        res.status(200).json({"data": user})
    } 
    else{
        res.status(401)
        throw new Error('Invalid User ID')
    }
})

const allUser = asyncHandler(async (req, res) => {

    const users = await Users.find({})

    if (users) {
        res.status(200).json({"data": users})
    } 
    else{
        res.status(401)
        throw new Error('Invalid User ID')
    }
})

const editUser = asyncHandler(async (req, res) => {
    const { id, firstname, lastname, email, role, route_id, bus_current_station, bus_latitude, bus_longitude } = req.body

    const user = await Users.findOneAndUpdate({id}, {
        firstname,
        lastname,
        email,
        invisible,
        role,
        route_id,
        bus_current_station,
        bus_latitude,
        bus_longitude
    },{new:true})
    
    if(user){
        res.status(200).json({"data": user})
    }
    else{
        res.status(401)
        throw new Error('Invalid Credentials')
    }
})

const authUser = asyncHandler(async (req, res) => {
    const { email, invisible } = req.body

    const user = await Users.findOne({email})

    if (user && (await user.matchInvisible(invisible))) {
        generateToken(res,user.id)
        res.status(200).json({"message": "Authenticated"})
    } 
    else{
        res.status(401)
        throw new Error('Invalid Credentials')
    }
})

const addUser = asyncHandler(async (req, res) => {
    const {firstname, lastname, email, invisible, role} = req.body
    const emailExist = await Users.findOne({ email })

    if (emailExist) {
        res.status(400)
        throw new Error('User Already Exist')
    }

    const update = await Sequence.findOneAndUpdate({name: "user"},{"$inc":{"val":1}},{new:true})
    let valID
    if (update === null) {
        Sequence.create({
            name: "user",
            val: 1001
        })
        valID = 1001
    }
    else{
        valID = update.val
    }

    const add = await Users.create({
        id: valID,
        firstname,
        lastname,
        email,
        invisible,
        role
    })

    if (add) {
        res.status(200).json({"message": "User Added"})
    }
    else{
        res.status(400)
        throw new Error('Invalid User Data')
    }
})

export {
    getUser,
    allUser,
    editUser,
    authUser,
    addUser,
}