import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findUserByName, createUser } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const SALT_ROUNDS = 10;

function isValidUsername(username) {
    return typeof username === "string"
        && username.length >= 3
        && username.length <= 32
        && /^[a-zA-Z0-9_]+$/.test(username);
}

function isValidPassword(password) {
    return typeof password === "string"
        && password.length >= 8
        && password.length <= 64;
}

export const registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!isValidUsername(username) || !isValidPassword(password)) {
            return res.status(400).send("Invalid username or password");
        }

        const existing = await findUserByName(username);
        if (existing) {
            return res.status(409).send("User already exists");
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        await createUser(username, passwordHash);

        return res.status(201).send({ message: "Register successful", username });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!isValidUsername(username) || !isValidPassword(password)) {
            return res.status(400).send("Invalid username or password");
        }

        const user = await findUserByName(username);
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
            return res.status(200).send({ message: "Login successful", token, username });
        }

        res.status(401).send("Login failed");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
};