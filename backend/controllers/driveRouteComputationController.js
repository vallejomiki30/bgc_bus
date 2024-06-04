import asyncHandler from 'express-async-handler'
import Sequence from '../models/sequence.js'

import Users from '../models/user.js'
import Routes from '../models/busRoute.js'
import Stations from '../models/busStation.js'
import fetch from 'node-fetch'
import Station from '../models/busStation.js'

function splitAndReconnect(array, splitValue) {
    let splitIndex = array.indexOf(splitValue);

    if (splitIndex === -1) {
        return "Value not found in the array";
    }

    let part1 = array.slice(0, splitIndex);
    let part2 = array.slice(splitIndex + 1);
    let newArray = [].concat(part2, part1, splitValue)
    return newArray;
}

const getETA = asyncHandler(async (req, res) => {
    const { route_id } = req.body
    const route = await Routes.find({ id: route_id })
    const checkDriver = await Users.find({route_id})
    let ETA = []
    let totalTime = 0

    
    const bus_current_station = checkDriver[0].bus_current_station
    const bus_longitude = checkDriver[0].bus_longitude
    const bus_latitude = checkDriver[0].bus_latitude
    const station_order = route[0].station_order

    let newArray = splitAndReconnect(station_order, bus_current_station);

    for (let i=0; i < newArray.length; i++) {
        const val = newArray[i];
        const station_details = await Stations.find({ id: val })
        const body_data = {
            "origin": {
                "via": false,
                "vehicleStopover": false,
                "sideOfRoad": false,
                "location": {
                    "latLng": {
                        "latitude": Number(bus_latitude),
                        "longitude": Number(bus_longitude)
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
                        "latitude": Number(station_details[0].latitude),
                        "longitude": Number(station_details[0].longitude)
                    },
                    "heading": 0
                }
            },
            "travelMode": "DRIVE",
            "routingPreference": "TRAFFIC_AWARE_OPTIMAL",
            "computeAlternativeRoutes": false
            };

            const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes?key=AIzaSyDcZQIjx3dHF_mmIEnLgb17TdakRDv7PWI&fields=routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline', {
            method: 'post',
            body: JSON.stringify(body_data),
            headers: {'Content-Type': 'application/json'}
            });
            const data = await response.json();
            const duration_raw = data.routes[0].duration.replace('s',"")
            const duration = Number(duration_raw) + totalTime
            const distance = data.routes[0].distanceMeters ? data.routes[0].distanceMeters : 0
            const minutes = Math.floor(duration / 60)
            const seconds = (duration % 60).toFixed(0)
            totalTime = totalTime + duration
            ETA.push({"station_id": station_details[0].id, "station_name": station_details[0].name, "duration": totalTime,"ETA_minutes": minutes, "ETA_seconds": Number(seconds), "distance": distance})
        }
    if (ETA) {
        res.status(200).json({"data": ETA})
    }
    else{
        res.status(400)
        throw new Error('Invalid User Input')
    }
})

const driveCompute = asyncHandler(async (req, res) => {
    const { email, bus_longitude, bus_latitude } = req.body
    const checkRole = await Users.find({ email, role: 'driver' })
    
    if (checkRole) {
        let ETA = []
        let totalTime = 0
        const route_id = checkRole[0].route_id
        const route = await Routes.find({ id: route_id })
        const bus_current_station = checkRole[0].bus_current_station
        const station_order = route[0].station_order

        let newArray = splitAndReconnect(station_order, bus_current_station);

        for (let i=0; i < newArray.length; i++) {
            const val = newArray[i];
            const station_details = await Stations.find({ id: val })
            const body_data = {
                "origin": {
                    "via": false,
                    "vehicleStopover": false,
                    "sideOfRoad": false,
                    "location": {
                        "latLng": {
                            "latitude": Number(bus_latitude),
                            "longitude": Number(bus_longitude)
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
                            "latitude": Number(station_details[0].latitude),
                            "longitude": Number(station_details[0].longitude)
                        },
                        "heading": 0
                    }
                },
                "travelMode": "DRIVE",
                "routingPreference": "TRAFFIC_AWARE_OPTIMAL",
                "computeAlternativeRoutes": false
                };

                const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes?key=AIzaSyDcZQIjx3dHF_mmIEnLgb17TdakRDv7PWI&fields=routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline', {
                method: 'post',
                body: JSON.stringify(body_data),
                headers: {'Content-Type': 'application/json'}
                });
                const data = await response.json();
                const duration_raw = data.routes[0].duration.replace('s',"")
                const duration = Number(duration_raw) + totalTime
                const distance = data.routes[0].distanceMeters ? data.routes[0].distanceMeters : 0
                const minutes = Math.floor(duration / 60)
                const seconds = (duration % 60).toFixed(0)
                totalTime = totalTime + duration
                ETA.push({"station_id": station_details[0].id, "station_name": station_details[0].name, "duration": totalTime,"ETA_minutes": minutes, "ETA_seconds": Number(seconds), "distance": distance})
          }
        if (ETA && duration <=  120) {
            const update = await Users.findOneAndUpdate({email: email},{"bus_current_station": newArray[0], bus_latitude, bus_longitude},{new:true})
            res.status(200).json({"data": ETA})
        }
        else if (ETA && duration > 120) {
            const update = await Users.findOneAndUpdate({email: email},{bus_latitude, bus_longitude},{new:true})
            res.status(200).json({"data": ETA})
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
    getETA,
    driveCompute,
}

