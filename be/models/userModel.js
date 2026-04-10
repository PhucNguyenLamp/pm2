import db from '../db/database.js'

const userCollection = db.collection("User");

export const findUserByName = async (username) => {
  return await userCollection.findOne({ username }, {
    projection: { username: 1, password: 1 }
  });
};

export const createUser = async (username, password) => {
  return await userCollection.insertOne({ username, password });
};