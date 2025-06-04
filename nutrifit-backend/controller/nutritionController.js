import { createRequire } from "module";
const require = createRequire(import.meta.url);
// Import mysql
const mysql = require('mysql2');
import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv/config"
import { v4 as uuidv4 } from "uuid"
import { authentication } from "./userController.js";

const connectionString = "mysql://root:@localhost:3306/NutriFit";

export async function getNutritionByGoalId(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);

        const decodedToken = await authentication(req);
        const userId = decodedToken.sub;
        const userVerification = await connection.promise().query(
            'SELECT * FROM NutriFit.user WHERE user_id = ?',
            [userId]
        );
        if (!userVerification[0] || userVerification[0].length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const [nutrition] = await connection.promise().query(
            'SELECT * FROM NutriFit.nutrition_logs WHERE user_id = ? AND goal_id = ?',
            [userId, req.body.goal_id]
        );

        return res.status(200).json({ data: nutrition });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}


export async function getNutritionByDate(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);

        const decodedToken = await authentication(req);
        const userId = decodedToken.sub;
        const userVerification = await connection.promise().query(
            'SELECT * FROM NutriFit.user WHERE user_id = ?',
            [userId]
        );
        if (!userVerification[0] || userVerification[0].length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const [nutrition] = await connection.promise().query(
            'SELECT * FROM NutriFit.nutrition_logs WHERE user_id = ? AND timestamp = ?',
            [userId, req.body.date]
        );

        return res.status(200).json({ data: nutrition });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}

export async function addNutritionFoodItem(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);

        const decodedToken = await authentication(req);
        const userId = decodedToken.sub;
        const userVerification = await connection.promise().query(
            'SELECT * FROM NutriFit.user WHERE user_id = ?',
            [userId]
        );
        if (!userVerification[0] || userVerification[0].length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        await connection.promise().query(
            `INSERT INTO NutriFit.nutrition_logs 
                (entry_id, user_id, food_item_id, quantity, timestamp, goal_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                uuidv4(),
                userId,
                req.body.food_item_id,
                req.body.quantity,
                new Date(),
                req.body.goal_id
            ]
        );

        return res.status(200).json({ message: 'Nutrition log added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}

export async function addNutritionRecipe(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);

        const decodedToken = await authentication(req);
        const userId = decodedToken.sub;
        const userVerification = await connection.promise().query(
            'SELECT * FROM NutriFit.user WHERE user_id = ?',
            [userId]
        );
        if (!userVerification[0] || userVerification[0].length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        await connection.promise().query(
            `INSERT INTO NutriFit.nutrition_logs 
                (entry_id, user_id, recipe_id, quantity, timestamp, goal_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                uuidv4(),
                userId,
                req.body.recipe_id,
                req.body.quantity,
                new Date(),
                req.body.goal_id
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

        const decodedToken = await authentication(req);
        const userId = decodedToken.sub;
        const userVerification = await connection.promise().query(
            'SELECT * FROM NutriFit.user WHERE user_id = ?',
            [userId]
        );
        if (!userVerification[0] || userVerification[0].length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        // `SELECT 
        //     nl.date,
        //     SUM(fi.calories * nl.quantity) as total_calories,
        //     SUM(fi.protein * nl.quantity) as total_protein,
        //     SUM(fi.carbohydrate * nl.quantity) as total_carbs,
        //     SUM(fi.fat * nl.quantity) as total_fat
        // FROM NutriFit.nutrition_logs nl
        // JOIN NutriFit.food_items fi ON nl.food_item_id = fi.food_item_id
        // WHERE nl.user_id = ? AND nl.date = ?
        // GROUP BY nl.date`,

        const [summary] = await connection.promise().query(
            `
            SELECT food_item_id, recipe_id, quantity from nutrition_logs
            WHERE user_id = ? AND goal_id = ?
            `,
            [userId, req.body.goal_id]
        );

        let calorieCount = 0;

        for(let i = 0; i < summary.length; i++) {
            const food_item_id = summary[i].food_item_id;
            const recipe_id = summary[i].recipe_id;
            const quantity = summary[i].quantity;

            if(food_item_id) {
                const [calorie_food_item] = await connection.promise().query(
                    `
                    SELECT calories FROM food_items WHERE food_item_id = ?
                    `, [food_item_id]
                ); 
                calorieCount += calorie_food_item[0].calories
            } 
            if(recipe_id) {
                const [recipe_item] = await connection.promise().query(
                    `
                    SELECT calories FROM recipes WHERE recipe_id = ?
                    `, [recipe_id]
                ); 
                calorieCount += recipe_item[0].calories
            }
        }
        console.log(calorieCount);

        return res.status(200).json({ data: summary, calories: calorieCount });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}
