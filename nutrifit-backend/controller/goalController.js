import { createRequire } from "module";
const require = createRequire(import.meta.url);
// Import mysql
const mysql = require('mysql2');
import { authentication } from "./userController.js";
import { calculateCalories } from "./nutritionController.js";
import { v4 as uuidv4 } from "uuid"
import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv/config"

const connectionString = "mysql://root:password@localhost:3306/NutriFit";
// const connectionString = "mysql://root:@localhost:3306/NutriFit";

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

        const decodedToken = await authentication(req);

        // Verify user exists
        const userId = decodedToken.sub;
        const userVerification = await connection.promise().query(
            'SELECT user_id, age, gender, weight, height, activity_level FROM NutriFit.user WHERE user_id = ?',
            [userId]
        );
        if (!userVerification[0] || userVerification[0].length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const userData = userVerification[0][0];

        const { age, gender, weight, height, activity_level} = userData;

        const goalType = Number(req.body.goal_type);
        const targetWeightChange = Number(req.body.target_weight_change);
        const targetTimeWeeks = Number(req.body.target_time_weeks);

        let calorieDeficit = 0;
        if (goalType === 1 || goalType === 2) {
            // 0.45 kg (1 lb) is approx. 3500 calories
            calorieDeficit = (((targetWeightChange / 0.45) * 3500) / (targetTimeWeeks * 7));
        }

        // Calculate Total Daily Energy Expenditure (TDEE)
        const bmr = mifflinStJeor(weight, height, age, gender);
        let targetCalories = bmr;

        const activityMultipliers = [
            1.2,    // 0: Sedentary
            1.375,  // 1: Light
            1.465,  // 2: Moderate (Fixed typo: 1,465 -> 1.465)
            1.55,   // 3: Active (Standardized value)
            1.725,  // 4: Very Active
            1.9     // 5: Extra Active
        ];
        targetCalories *= activityMultipliers[activity_level] || 1.2;

        // Adjust calories based on goal type
        if (goalType === 1) { // Lose weight
            targetCalories -= calorieDeficit;
        } else if (goalType === 2) { // Gain weight
            targetCalories += calorieDeficit;
        }

        // Define goal start and end dates
        const startDate = new Date().toISOString().split('T')[0]; // Today 'YYYY-MM-DD'
        const endDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]; // Tomorrow 'YYYY-MM-DD'
        
        // Delete duplicate goals jika ada
        await connection.promise().query(
            `
            DELETE FROM Nutrifit.goals WHERE user_id = ? AND start_date = ?
            `, [ userId, startDate]
        )

        await connection.promise().query(
            `INSERT INTO NutriFit.goals 
                (goal_id, user_id, goal_type, target_calories_per_day, start_date, end_date)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                uuidv4(),
                userId,
                req.body.goal_type,
                targetCalories,
                startDate,
                endDate
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

        const decodedToken = await authentication(req);
        const userId = decodedToken.sub;

        const [goalSearch] = await connection.promise().query(
            `
            SELECT goal_type, target_calories_per_day FROM NutriFit.goals
            WHERE user_id=?
            ORDER BY end_date DESC
            LIMIT 1
            `, 
            [userId]
        )

        if (!goalSearch[0] || goalSearch[0].length === 0) {
            return res.status(404).json({ error: "No previous day's goal found to copy" });
        }
        const goalType = goalSearch[0].goal_type;
        const targetCalories = goalSearch[0].target_calories_per_day;
        const startDate = new Date().toISOString().split('T')[0]; // Today 'YYYY-MM-DD'
        const endDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]; // Tomorrow 'YYYY-MM-DD'

        const [deleteDuplicateGoal] = await connection.promise().query(
            `
            DELETE FROM NutriFit.goals 
            WHERE user_id = ? AND start_date = ?;
            `, [userId, startDate]
        );

        const [insertGoal] = await connection.promise().query(
            `
            INSERT INTO NutriFit.goals
                (goal_id, user_id, goal_type, target_calories_per_day, start_date, end_date)
            VALUES
                (?, ?, ?, ?, ?, ?)
            `, [uuidv4(), userId, goalType, targetCalories, startDate, endDate]
        );

        return res.status(201).json({ message: "Previous goal succesfully copied to today" });
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: "Unexpected error occured" });
    }
}

export async function getGoalInfo(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);

        const decodedToken = await authentication(req);
        const userId = decodedToken.sub;
        const userVerification = await connection.promise().query(
            'SELECT user_id FROM NutriFit.user WHERE user_id = ?',
            [userId]
        );
        if (!userVerification[0] || userVerification[0].length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const [goals] = await connection.promise().query(
            'SELECT * FROM NutriFit.goals WHERE user_id = ?',
            [userId]
        );

        return res.status(200).json({ data: goals });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Unexpected error occurred' }); 
    }
}

export async function getCalorieNeeded(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);

        const decodedToken = await authentication(req);

        // Verify user exists
        const userId = decodedToken.sub;
        const userVerification = await connection.promise().query(
            'SELECT user_id FROM NutriFit.user WHERE user_id = ?',
            [userId]
        );
        if (!userVerification[0] || userVerification[0].length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const goalId = req.query.goal_id;
            if (!goalId) {
            return res.status(400).json({ error: "Goal Id Not Provided" });
        }

        const [goals] = await connection.promise().query(
            `SELECT target_calories_per_day FROM goals WHERE goal_id=?`,
            [goalId]
        );

        if (!goals || goals.length === 0) {
            return res.status(404).json({ error: "Goal not found" });
        }
    
        const goalCalories = goals[0].target_calories_per_day;
        const consumedCalories = await calculateCalories(userId, goalCalories);
        const caloriesDeficit = goalCalories - Number(consumedCalories);
        return res.status(200).json({ 
            goal_calories: goalCalories,
            consumed_calories: consumedCalories,
            calories_deficit: caloriesDeficit || 0
        });
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: err});
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
