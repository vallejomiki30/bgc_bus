import mongoose from "mongoose";

const routeSchema = mongoose.Schema(
    {
        id: {
            type: String,
            required: [true, "Please enter id."]
        },
        name: {
            type: String,
            required: [true, "Please enter the name for this Route."]
        },
        price: {
            type: Number,
            required: [true, "Please enter the corresponding price for Route."]
        },
        addedBy: {
            type: String,
            default: "1001"
        },
        station_order: {
            type: Array,
            default: null
        }
    },
    {
        timestamps: true
    }
)

const Route = mongoose.models.route || mongoose.model('route', routeSchema);

export default Route