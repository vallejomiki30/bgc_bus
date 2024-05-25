import asyncHandler from 'express-async-handler'
import Sequence from '../models/sequence.js'
import Stations from '../models/busStation.js'
import Users from '../models/user.js'

const getStations = asyncHandler(async (req, res) => {
    const data = {"route": "test_route"}
    if (data) {
        res.status(200).json(data)
    }
    else {
        res.status(400)
        throw new Error('Something went wrong')
    }
})

const addStation = asyncHandler(async (req, res) => {
    const {email, role, route_id, route_name, name, longitude, latitude, addedBy} = req.body

    const userValidate = await Users.findOne({ email, role })

    if (userValidate) {
        const update = await Sequence.findOneAndUpdate({name: "station"},{"$inc":{"val":1}},{new:true})
        let valID
        if (update === null) {
            Sequence.create({
                name: "station",
                val: 1001
            })
            valID = 1001
        }
        else{
            valID = update.val
        }
    
        const add = await Stations.create({
            id: valID,
            route_id,
            route_name,
            name,
            longitude,
            latitude,
            addedBy
        })
    
        if (add) {
            res.status(200).json({"message": "Station Added"})
        }
        else{
            res.status(400)
            throw new Error('Invalid Station Data')
        }
    }
    else{
        res.status(400)
        throw new Error('Invalid Data')
    }
})

const editStation = asyncHandler(async (req, res) => {
    const {email, role, id, route_id, route_name, name, longitude, latitude} = req.body

    const userValidate = await Users.findOne({ email, role })

    if (userValidate) {

        const edit = await Stations.findOneAndUpdate({id}, {
            route_id,
            route_name,
            name,
            longitude,
            latitude,
        },{new:true})
        
        if (edit) {
            res.status(200).json({"data": edit, "message": "Edited Station"})
        }
        else{
            res.status(400)
            throw new Error('Invalid Station Data')
        }
    }

    else {
        res.status(400)
        throw new Error('Invalid Data')
    }
})

const deleteStation = asyncHandler(async (req, res) => {
    const {email, role, id} = req.body

    const userValidate = await Users.findOne({ email, role })

    if (userValidate) {

        const deletion = await Stations.deleteOne({id})
        
        if (deletion) {
            res.status(200).json({"message": "Station Deleted"})
        }
        else{
            res.status(400)
            throw new Error('Invalid Station Data')
        }
    }

    else {
        res.status(400)
        throw new Error('Invalid Data')
    }
})

export {
    getStations,
    addStation,
    editStation,
    deleteStation,
}