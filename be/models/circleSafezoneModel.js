import db from '../db/database.js';

const circleSafezoneCollection = db.collection('CircleSafezone');

export const createCircleSafezone = async (lat, lon, radius) => {
    return await circleSafezoneCollection.insertOne({
        lat,
        lon,
        radius,
        createdAt: new Date()
    });
};

export const getCircleSafezone = async () => {
    // return await circleSafezoneCollection.find({}).toArray();
    // now testing, only get the latest one
    return await circleSafezoneCollection.findOne({}, { sort: { createdAt: -1 } });
};