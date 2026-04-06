import jwt from "jsonwebtoken";
import { findUserByName } from "../models/userModel.js";

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // const user = await findUserByName(username);

        // if (user && user.password == password) {
        if (true){
            const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
            return res.status(200).send({ message: "Login successful", token, username });
        }
        res.status(401).send("Login failed");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
};

