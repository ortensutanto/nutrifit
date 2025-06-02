import { createRequire } from "module";
const require = createRequire(import.meta.url);
// Import mysql
const mysql = require('mysql2');
import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv/config"
import { v4 as uuidv4 } from "uuid"

const connectionString = "mysql://root:password@localhost:3306/NutriFit";

export async function getNutritionByDate(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const [nutrition] = await connection.promise().query(
            'SELECT * FROM NutriFit.nutrition_logs WHERE user_id = ? AND date = ?',
            [req.body.user_id, req.body.date]
        );

        return res.status(200).json({ data: nutrition });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}

export async function addNutrition(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        await connection.promise().query(
            `INSERT INTO NutriFit.nutrition_logs 
                (nutrition_log_id, user_id, food_item_id, date, quantity, unit)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                uuidv4(),
                req.body.user_id,
                req.body.food_item_id,
                req.body.date,
                req.body.quantity,
                req.body.unit
            ]
        );

        return res.status(200).json({ message: 'Nutrition log added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}

export async function getNutritionSummary(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const [summary] = await connection.promise().query(
            `SELECT 
                nl.date,
                SUM(fi.calories * nl.quantity) as total_calories,
                SUM(fi.protein * nl.quantity) as total_protein,
                SUM(fi.carbohydrate * nl.quantity) as total_carbs,
                SUM(fi.fat * nl.quantity) as total_fat
            FROM NutriFit.nutrition_logs nl
            JOIN NutriFit.food_items fi ON nl.food_item_id = fi.food_item_id
            WHERE nl.user_id = ? AND nl.date = ?
            GROUP BY nl.date`,
            [req.body.user_id, req.body.date]
        );

        return res.status(200).json({ data: summary });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}
