import { createLocation, getCurrentLocation, getLocations } from '../models/locationModel.js';

function isValidLatitude(value) {
    return typeof value === 'number' && value >= -90 && value <= 90;
}

function isValidLongitude(value) {
    return typeof value === 'number' && value >= -180 && value <= 180;
}


export const createLocationHandler = async (req, res) => {
    const { lat, lon } = req.body;
    try {
        if (!isValidLatitude(lat) || !isValidLongitude(lon)) {
            return res.status(400).send('Invalid latitude or longitude');
        }

        await createLocation(lat, lon);
        return res.status(201).send({ message: 'Location received' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

export const getLocationsHandler = async (req, res) => {
    try {
        const locations = await getLocations();
        return res.status(200).json(locations);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

export const getCurrentLocationHandler = async (req, res) => {
    try {
        const location = await getCurrentLocation();
        if (!location) {
            return res.status(404).send('No location found');
        }
        return res.status(200).json(location);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

