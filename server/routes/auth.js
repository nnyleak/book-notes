import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "../db.js";

const router = express.Router();

// register new user (unused, admin made thru postman)
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
        const result = await sql`INSERT INTO users (username, password) VALUES (${username}, ${hashed}) RETURNING *`;
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "failed to register user" });
    }
});

// login user
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await sql`SELECT * FROM users WHERE username = ${username}`;
        const user = result[0];  
        if (!user) {
            return res.status(401).json({ error: "user not found" });
        };

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: "invalid password" });
        };

        const token = jwt.sign({ userId: user.id }, process.env.SECRET); 
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "failed to login" });
    }
});

export default router;