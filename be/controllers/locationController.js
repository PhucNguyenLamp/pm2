import { createLocation } from '../models/locationModel.js';

function isValidLatitude(value) {
    return typeof value === 'number' && value >= -90 && value <= 90;
}

function isValidLongitude(value) {
    return typeof value === 'number' && value >= -180 && value <= 180;
}

export const createLocationHandler = async (req, res) => {
    const { latitude, longitude } = req.body;
    try {
        if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
            return res.status(400).send('Invalid latitude or longitude');
        }

        await createLocation(latitude, longitude);
        return res.status(201).send({ message: 'Location received' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};