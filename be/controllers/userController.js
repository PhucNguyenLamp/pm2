import jwt from "jsonwebtoken";
import { findUserByName } from "../models/userModel.js";

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // uncomment 2 dòng này khi đã tạo user trong database
        // const user = await findUserByName(username);
        // if (user && user.password == password) {
        console.log("Login attempt:", username, password);

        if (true){ // comment dòng này khi đã tạo user trong database
            const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
            return res.status(200).send({ message: "Login successful", token, username });
        }
        res.status(401).send("Login failed");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
};

