import asyncHandler from 'express-async-handler'
import Drivers from '../models/driver.js'
import generateToken from '../util/generateToken.js'

const getDriver = asyncHandler(async (req, res) => {
    const { email } = req.body

    const driver = await Drivers.findOne({email})

    if (driver) {
        res.status(200).json({"data": driver})
    } 
    else{
        res.status(401)
        throw new Error('Invalid User ID')
    }
})

const allDriver = asyncHandler(async (req, res) => {

    const drivers = await Drivers.find({})

    if (drivers) {
        res.status(200).json({"data": drivers})
    } 
    else{
        res.status(401)
        throw new Error('Invalid User ID')
    }
})

const editDriver = asyncHandler(async (req, res) => {
    const { driver_name,plate_number,bus_route,email,password } = req.body

    const driver_old = await Drivers.findOne({email})
    let new_driver_name
    let new_plate_number
    let new_bus_route
    let new_email
    let new_password

    if (driver_name == driver_old.driver_name) {
        new_driver_name = driver_old.driver_name
    }
    else{
        new_driver_name = driver_old.driver_name
    }

    if (plate_number == driver_old.plate_number) {
        new_plate_number = driver_old.plate_number
    }
    else {
        new_plate_number = driver_old.plate_number
    }

    if (bus_route == driver_old.bus_route) {
        new_bus_route = driver_old.bus_route
    }
    else{
        new_bus_route = driver_old.bus_route
    }

    if (email == driver_old.email) {
        new_email = driver_old.email
    }
    else{
        new_email = driver_old.email
    }

    if (password == driver_old.password) {
        new_password = driver_old.password
    }
    else{
        new_password = driver_old.password
    }

    const driver = await Drivers.findOneAndUpdate({email}, {
        driver_name,
        plate_number,
        bus_route,
        email,
        password,
    },{new:true})
    
    if(driver){
        res.status(200).json({"data": driver})
    }
    else{
        res.status(401)
        throw new Error('Invalid Credentials')
    }
})

const authDriver = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const driver = await Drivers.findOne({email, password})

    if (driver) {
        generateToken(res,driver.email)
        res.status(200).json({"message": "Authenticated"})
    } 
    else{
        res.status(401)
        throw new Error('Invalid Credentials')
    }
})

const addDriver = asyncHandler(async (req, res) => {
    const {driver_name, plate_number, bus_route, email, password} = req.body
    const emailExist = await Drivers.findOne({ email })

    if (emailExist) {
        res.status(400)
        throw new Error('User Already Exist')
    }

    const add = await Drivers.create({
        driver_name,
        plate_number,
        bus_route,
        email,
        password
    })

    if (add) {
        res.status(200).json({"message": "User Added"})
    }
    else{
        res.status(400)
        throw new Error('Invalid User Data')
    }
})


const deleteDriver = asyncHandler(async (req, res) => {
    const {email} = req.body


    const deletion = await Drivers.deleteOne({email})
    
    if (deletion) {
        res.status(200).json({"message": "Driver Deleted"})
    }
    else{
        res.status(400)
        throw new Error('Invalid Driver Data')
    }

})

export {
    getDriver,
    allDriver,
    editDriver,
    authDriver,
    addDriver,
    deleteDriver,
}