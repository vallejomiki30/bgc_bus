import mongoose from "mongoose";

const driverSchema = mongoose.Schema(
    {
        driver_name: {
            type: String,
            required: [true, "Please enter id."]
        },
        plate_number: {
            type: String,
            required: [true, "Please enter your firstname."]
        },
        bus_route: {
            type: String,
            required: [true, "Please enter your lastname."]
        },
        email: {
            type: String,
            required: [true, "Please enter your email address."]
        },
        password: {
            type: String,
            required: [true, "Please enter your password."]
        },
    },
    {
        timestamps: true
    }
)


const Driver = mongoose.models.route || mongoose.model('drivers', driverSchema);

export default Driver