import { createRequire } from "module";
const require = createRequire(import.meta.url);
// Import mysql
const mysql = require('mysql2');
import { authentication } from "./userController.js";
import { v4 as uuidv4 } from "uuid"
import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv/config"

const connectionString = "mysql://root:password@localhost:3306/NutriFit";

function mifflinStJeor(weight, height, age, gender) {
    // gender: 0 (Male), 1 (Female)
    // BMR
    if (Number(gender) == 0) {
        return ((10 * weight) + (6.25 * height) - (5 * age) + 5);
    } else {
        return ((10 * weight) + (6.25 * height) - (5 * age) - 161);
    }
}

export async function calculateGoals(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        await connection.promise().query(
            `INSERT INTO NutriFit.goals 
                (goal_id, user_id, target_calories, target_protein, target_carbs, target_fat, start_date, end_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                uuidv4(),
                req.body.user_id,
                req.body.target_calories,
                req.body.target_protein,
                req.body.target_carbs,
                req.body.target_fat,
                req.body.start_date,
                req.body.end_date
            ]
        );

        return res.status(201).json({ message: 'Goal created successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}

/**
 * Copies the user's most recent goal to the current day.
 * If a goal for the current day already exists, it is replaced.
 */
export async function copyPreviousGoal(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        await connection.promise().query(
            `INSERT INTO NutriFit.goals 
                (goal_id, user_id, target_calories, target_protein, target_carbs, target_fat, start_date, end_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                uuidv4(),
                req.body.user_id,
                req.body.target_calories,
                req.body.target_protein,
                req.body.target_carbs,
                req.body.target_fat,
                req.body.start_date,
                req.body.end_date
            ]
        );

        return res.status(201).json({ message: 'Previous goal successfully copied to today' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}

export async function getGoalInfo(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const [goals] = await connection.promise().query(
            'SELECT * FROM NutriFit.goals WHERE user_id = ?',
            [req.body.user_id]
        );

        return res.status(200).json({ data: goals });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}

export async function getGoals(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const [goals] = await connection.promise().query(
            'SELECT * FROM NutriFit.goals WHERE user_id = ?',
            [req.body.user_id]
        );

        return res.status(200).json({ data: goals });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}

export async function updateGoal(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        await connection.promise().query(
            `UPDATE NutriFit.goals 
            SET target_calories = ?, 
                target_protein = ?, 
                target_carbs = ?, 
                target_fat = ?, 
                end_date = ?
            WHERE goal_id = ? AND user_id = ?`,
            [
                req.body.target_calories,
                req.body.target_protein,
                req.body.target_carbs,
                req.body.target_fat,
                req.body.end_date,
                req.body.goal_id,
                req.body.user_id
            ]
        );

        return res.status(200).json({ message: 'Goal updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}
