import { createRequire } from "module";
const require = createRequire(import.meta.url);
// Import mysql
const mysql = require('mysql2');
import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv/config"
import { v4 as uuidv4 } from "uuid"

const connectionString = "mysql://root:password@localhost:3306/NutriFit";

export async function scanBarcode(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const [foodItem] = await connection.promise().query(
            'SELECT * FROM NutriFit.food_items WHERE barcode = ?',
            [req.body.barcode]
        );

        if (!foodItem || foodItem.length === 0) {
            return res.status(404).json({ error: 'Food item not found' });
        }

        return res.status(200).json({ data: foodItem[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}

export async function addBarcodeItem(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        await connection.promise().query(
            `INSERT INTO NutriFit.food_items 
                (food_item_id, name, barcode, calories, protein, carbohydrate, fat)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                uuidv4(),
                req.body.name,
                req.body.barcode,
                req.body.calories,
                req.body.protein,
                req.body.carbohydrate,
                req.body.fat
            ]
        );

        return res.status(201).json({ message: 'Food item added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}

