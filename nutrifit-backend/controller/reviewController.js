import { createRequire } from "module";
const require = createRequire(import.meta.url);
// Import mysql
const mysql = require('mysql2');
import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv/config"
import { v4 as uuidv4 } from "uuid"
import { authentication } from "./userController.js"

const connectionString = "mysql://root:password@localhost:3306/NutriFit";
// const connectionString = "mysql://root:@localhost:3306/NutriFit";

export async function getReviews(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const [reviews] = await connection.promise().query(
            'SELECT * FROM NutriFit.reviews WHERE recipe_id = ?',
            [req.body.recipe_id]
        );

        return res.status(200).json({ data: reviews });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}

export async function addReviews(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const decodedToken = await authentication(req);
        // Verify user exists
        const userId = decodedToken.sub;
        const userVerification = await connection.promise().query(
            'SELECT * FROM NutriFit.user WHERE user_id = ?',
            [userId]
        );
        if (!userVerification[0] || userVerification[0].length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        await connection.promise().query(
            `INSERT INTO NutriFit.reviews 
                (review_id, recipe_id, user_id, rating, comment, created_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                uuidv4(),
                req.body.recipe_id,
                userId,
                req.body.rating,
                req.body.comment,
                new Date()
            ]
        );

        return res.status(201).json({ message: 'Review added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}
