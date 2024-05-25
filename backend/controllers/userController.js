import crypto from 'crypto'
import asyncHandler from 'express-async-handler'
import Sequence from '../models/sequence.js'
import Users from '../models/user.js'
import generateToken from '../util/generateToken.js'

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
    authUser,
    addUser,
}