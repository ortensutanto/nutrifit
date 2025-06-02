import { createRequire } from "module";
const require = createRequire(import.meta.url);
// Import mysql
const mysql = require('mysql2');
import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv/config"
import { v4 as uuidv4 } from "uuid"

const connectionString = "mysql://root:password@localhost:3306/NutriFit";

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
        await connection.promise().query(
            `INSERT INTO NutriFit.reviews 
                (review_id, recipe_id, user_id, rating, comment, created_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                uuidv4(),
                req.body.recipe_id,
                req.body.user_id,
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
