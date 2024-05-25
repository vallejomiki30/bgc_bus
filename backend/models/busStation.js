import mongoose from "mongoose";

const stationSchema = mongoose.Schema(
    {
        id: {
            type: String,
            required: [true, "Please enter id."]
        },
        route_id: {
            type: String,
            required: [true, "Please enter the route ID for this Station."]
        },
        route_name: {
            type: String,
            required: [true, "Please enter the route name for this Station."]
        },
        name: {
            type: String,
            required: [true, "Please enter the name for this Station."]
        },
        longitude: {
            type: String,
            required: [true, "Please enter the longitude for this Station."]
        },
        latitude: {
            type: String,
            required: [true, "Please enter the latitude for this Station."]
        },
        addedBy: {
            type: String,
            default: "1001"
        },
    },
    {
        timestamps: true
    }
)

const Station = mongoose.models.station || mongoose.model('station', stationSchema);

export default Station