import asyncHandler from 'express-async-handler'
import Stations from '../models/busStation.js'
import fetch from 'node-fetch'

const walkCompute = asyncHandler(async (req, res) => {
    const { longitude, latitude, route_id } = req.body
    const stations = await Stations.find({ route_id })

    let nearest = []

    if (stations) {

        let collated = await Promise.all(
            stations.map(async (station) => {
                const body_data = {
                    "origin": {
                        "via": false,
                        "vehicleStopover": false,
                        "sideOfRoad": false,
                        "location": {
                            "latLng": {
                                "latitude": Number(latitude),
                                "longitude": Number(longitude)
                            },
                            "heading": 0
                        }
                    },
                    "destination": {
                        "via": false,
                        "vehicleStopover": false,
                        "sideOfRoad": false,
                        "location": {
                            "latLng": {
                                "latitude": Number(station.latitude),
                                "longitude": Number(station.longitude)
                            },
                            "heading": 0
                        }
                    },
                    "travelMode": "WALK"
                    };

                    const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes?key=AIzaSyDcZQIjx3dHF_mmIEnLgb17TdakRDv7PWI&fields=routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline', {
                    method: 'post',
                    body: JSON.stringify(body_data),
                    headers: {'Content-Type': 'application/json'}
                });
                const data = await response.json();
                const duration_raw = data.routes[0].duration.replace('s',"")
                const duration = Number(duration_raw)
                const distance = data.routes[0].distanceMeters ? data.routes[0].distanceMeters : 0
                const minutes = Math.floor(duration / 60)
                const seconds = (duration % 60).toFixed(0)
                nearest.push({"station_name": station.name, "duration": duration,"ETA_minutes": minutes, "ETA_seconds": Number(seconds), "distance": distance, "longitude": station.longitude, "latitude": station.latitude})
            })
        )

        let sorted_nearest = nearest.sort(({duration:a}, {duration:b}) => a-b);
        if (sorted_nearest) {
            res.status(200).json({"data": sorted_nearest})
        }
        else{
            res.status(400)
            throw new Error('Invalid User Input')
        }
    }
    else{
        res.status(400)
        throw new Error('Invalid User Data')
    }
    
})

export {
    walkCompute,
}