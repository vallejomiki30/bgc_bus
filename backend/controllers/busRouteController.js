import asyncHandler from 'express-async-handler'
import Sequence from '../models/sequence.js'
import Routes from '../models/busRoute.js'
import Users from '../models/user.js'

const getRoutes = asyncHandler(async (req, res) => {
    const data = {"route": "test_route"}
    if (data) {
        res.status(200).json(data)
    }
    else {
        res.status(400)
        throw new Error('Something went wrong')
    }
})

const addRoute = asyncHandler(async (req, res) => {
    const {email, role, name, price, addedBy} = req.body

    const userValidate = await Users.findOne({ email, role })

    if (userValidate) {

        const update = await Sequence.findOneAndUpdate({name: "route"},{"$inc":{"val":1}},{new:true})
        let valID
        if (update === null) {
            Sequence.create({
                name: "route",
                val: 1001
            })
            valID = 1001
        }
        else{
            valID = update.val
        }

        const add = await Routes.create({
            id: valID,
            name,
            price,
            addedBy
        })

        if (add) {
            res.status(200).json({"message": "Route Added"})
        }
        else{
            res.status(400)
            throw new Error('Invalid Route Data')
        }
    }

    else{
        res.status(400)
        throw new Error('Invalid Route')
    }
})

const editRoute = asyncHandler(async (req, res) => {
    const {email, role, id, name, price,} = req.body

    const userValidate = await Users.findOne({ email, role })

    if (userValidate) {

        const add = await Routes.findOneAndUpdate({id}, {
            id: valID,
            name,
            price,
        })

        if (add) {
            res.status(200).json({"message": "Edited Route"})
        }
        else{
            res.status(400)
            throw new Error('Invalid Route Data')
        }
    }

    else{
        res.status(400)
        throw new Error('Invalid Route')
    }
})

const deleteRoute = asyncHandler(async (req, res) => {
    const {email, role, id} = req.body

    const userValidate = await Users.findOne({ email, role })

    if (userValidate) {

        const deletion = await Routes.deleteOne({id})
        
        if (deletion) {
            res.status(200).json({"message": "Route Deleted"})
        }
        else{
            res.status(400)
            throw new Error('Invalid Route Data')
        }
    }

    else {
        res.status(400)
        throw new Error('Invalid Route')
    }
})

export {
    getRoutes,
    addRoute,
    editRoute,
    deleteRoute
}