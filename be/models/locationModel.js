import db from '../db/database.js';

const locationCollection = db.collection('Location');

export const createLocation = async (latitude, longitude) => {
    return await locationCollection.insertOne({
        latitude,
        longitude,
        createdAt: new Date()
    });
};