import db from '../db/database.js';

const rectangleSafezoneCollection = db.collection('RectangleSafezone');

export const createRectangleSafezone = async (north, south, east, west, rotation) => {
    return await rectangleSafezoneCollection.insertOne({
        north,
        south,
        east,
        west,
        rotation,
        createdAt: new Date()
    });
};

export const getRectangleSafezone = async () => {
    // return await rectangleSafezoneCollection.find({}).toArray();
    // now testing, only get the latest one
    return await rectangleSafezoneCollection.findOne({}, { sort: { createdAt: -1 } });
};
