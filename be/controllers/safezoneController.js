import { createRectangleSafezone, getRectangleSafezone } from '../models/rectangleSafezoneModel.js';
import { createCircleSafezone, getCircleSafezone } from '../models/circleSafezoneModel.js';
import { getCurrentLocation } from '../models/locationModel.js';
import { checkSafezone } from '../arduinoCloud/client.js';

export const createRectangleSafezoneHandler = async (req, res) => {
    /// the reactangle can be rotated, 
    // north lat, south lat, east lon, west lon, rotation in degree
    const { north, south, east, west, rotation } = req.body;
    // validate input
    // if (
    //     !isValidLatitude(north) || !isValidLatitude(south) ||
    //     !isValidLongitude(east) || !isValidLongitude(west) ||
    //     typeof rotation !== 'number' 
    // ) {
    //     console.log("Invalid rectangle safezone parameters:", { north, south, east, west, rotation });
    //     return res.status(400).send('Invalid rectangle coordinates');
    // }
    // save to database
    await createRectangleSafezone(north, south, east, west, rotation);
    return res.status(201).send({ message: 'Rectangle safezone created' });
}

export const createCircleSafezoneHandler = async (req, res) => {
    const { lat, lon, radius } = req.body;
    // if (!isValidLatitude(lat) || !isValidLongitude(lon) || typeof radius !== 'number' || radius <= 0) {
    //     return res.status(400).send('Invalid circle parameters');
    // }
    // save to database
    await createCircleSafezone(lat, lon, radius);
    return res.status(201).send({ message: 'Circle safezone created' });
}

export const getSafezonesHandler = async (req, res) => {
    // get latest rectangle safezone and circle safezone
    const rectangleSafezone = await getRectangleSafezone();
    const circleSafezone = await getCircleSafezone();
    return res.status(200).json({ rectangleSafezone, circleSafezone });
}

export const checkSafezoneHandler = async (req, res) => {
    const inside = await checkSafezone();
    return res.status(200).json({ inside });
}
const isValidLatitude = value => value >= -90 && value <= 90;

const isValidLongitude = value => value >= -180 && value <= 180;
