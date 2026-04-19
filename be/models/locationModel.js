import db from '../db/database.js';

const locationCollection = db.collection('Location');

export const createLocation = async (lat, lon, insideSafezone) => {
    return await locationCollection.insertOne({
        lat,
        lon,
        insideSafezone,
        createdAt: new Date()
    });
};

export const getLocations = async () => {
    return await locationCollection.find({}).toArray();
};

export const getCurrentLocation = async () => {
    return await locationCollection.findOne({}, { sort: { createdAt: -1 } });
};