import {createRequire} from "module";
const require = createRequire(import.meta.url);
// Import sql
const sql = require('mssql/msnodesqlv8');
import { authentication } from "./userController.js";
import { v4 as uuidv4 }from "uuid"

const config = {
    server: ".",
    database: "NutriFit",
    options: {
        trustedConnection: true,
        trustServerCertificate: true,
    },
    driver: "msnodesqlv8"
};

function mifflinStJeor(weight, height, age, gender) {
    // gender: 0 (Male), 1 (Female)
    // BMR
    if(Number(gender) == 0) {
        return ((10 * weight) + (6.25 * height) - (5 * age) + 5);
    } else {
        return ((10 * weight) + (6.25 * height) - (5 * age) - 161);
    }
}

export async function calculateGoals(req, res) {
    try {
        await sql.connect(config);

        // Authenticate user and get user details
        const decodedToken = await authentication(req);
        const userId = decodedToken.sub;

        const userRequest = new sql.Request();
        userRequest.input('user_id', sql.UniqueIdentifier, userId);
        const userQuery = 'SELECT user_id, age, gender, weight, height, activity_level FROM [NutriFit].[user] WHERE user_id = @user_id';
        const userResult = await userRequest.query(userQuery);

        if (!userResult.recordset || userResult.recordset.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { weight, height, age, gender, activity_level } = userResult.recordset[0];
        const activityLevel = activity_level || 0;

        // Goal parameters from request
        const goalType = Number(req.body.goal_type); // 0: maintain, 1: lose, 2: gain
        const targetWeightChange = Number(req.body.target_weight_change);
        const targetTimeWeeks = Number(req.body.target_time_week);

        // Calculate daily calorie adjustment for weight change goals
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
        targetCalories *= activityMultipliers[activityLevel] || 1.2;

        // Adjust calories based on goal type
        if (goalType === 1) { // Lose weight
            targetCalories -= calorieDeficit;
        } else if (goalType === 2) { // Gain weight
            targetCalories += calorieDeficit;
        }

        // Define goal start and end dates
        const startDate = new Date().toISOString().split('T')[0]; // Today 'YYYY-MM-DD'
        const endDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]; // Tomorrow 'YYYY-MM-DD'

        // ** Check for and delete an existing goal for the same day **
        const goalDeleteRequest = new sql.Request();
        goalDeleteRequest.input('user_id', sql.UniqueIdentifier, userId);
        goalDeleteRequest.input('start_date', sql.Date, startDate);
        const deleteQuery = `DELETE FROM [NutriFit].[goals] WHERE user_id = @user_id AND start_date = @start_date`;
        await goalDeleteRequest.query(deleteQuery);

        // Insert the new goal
        const goalInsertRequest = new sql.Request();
        const goalId = uuidv4();
        goalInsertRequest.input('goal_id', sql.UniqueIdentifier, goalId);
        goalInsertRequest.input('user_id', sql.UniqueIdentifier, userId);
        goalInsertRequest.input('goal_type', sql.Int, goalType);
        goalInsertRequest.input('target_calories_per_day', sql.Int, Math.round(targetCalories));
        goalInsertRequest.input('start_date', sql.Date, startDate);
        goalInsertRequest.input('end_date', sql.Date, endDate);

        const insertQuery = `
            INSERT INTO [NutriFit].[goals]
                (goal_id, user_id, goal_type, target_calories_per_day, start_date, end_date)
            VALUES
                (@goal_id, @user_id, @goal_type, @target_calories_per_day, @start_date, @end_date)
        `;
        
        await goalInsertRequest.query(insertQuery);
        return res.status(201).json({ message: 'Goal successfully created' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected Error Occurred' });
    } finally {
        sql.close();
    }
}


/**
 * Copies the user's most recent goal to the current day.
 * If a goal for the current day already exists, it is replaced.
 */
export async function copyPreviousGoal(req, res) {
    try {
        await sql.connect(config);

        // Authenticate user
        const decodedToken = await authentication(req);
        const userId = decodedToken.sub;

        // Get today's date to find the previous day's goal record
        const today = new Date().toISOString().split('T')[0];

        // Find the goal from the previous day (where its end_date is today)
        const goalSearchRequest = new sql.Request();
        goalSearchRequest.input('user_id', sql.UniqueIdentifier, userId);
        goalSearchRequest.input('current_start_date', sql.Date, today);
        const goalSearchQuery = `
            SELECT goal_type, target_calories_per_day FROM [NutriFit].[goals]
            WHERE user_id = @user_id AND end_date = @current_start_date
        `;
        const goalSearchResult = await goalSearchRequest.query(goalSearchQuery);

        if (!goalSearchResult.recordset || goalSearchResult.recordset.length === 0) {
            return res.status(404).json({ error: "No previous day's goal found to copy" });
        }

        const { goal_type, target_calories_per_day } = goalSearchResult.recordset[0];

        // Define new goal dates
        const newStartDate = today;
        const newEndDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

        // ** Check for and delete an existing goal for the same day before copying **
        const goalDeleteRequest = new sql.Request();
        goalDeleteRequest.input('user_id', sql.UniqueIdentifier, userId);
        goalDeleteRequest.input('start_date', sql.Date, newStartDate);
        const deleteQuery = `DELETE FROM [NutriFit].[goals] WHERE user_id = @user_id AND start_date = @start_date`;
        await goalDeleteRequest.query(deleteQuery);

        // Insert the copied goal for the current day
        const goalInsertRequest = new sql.Request();
        const newGoalId = uuidv4();
        goalInsertRequest.input('goal_id', sql.UniqueIdentifier, newGoalId);
        goalInsertRequest.input('user_id', sql.UniqueIdentifier, userId);
        goalInsertRequest.input('goal_type', sql.Int, goal_type);
        goalInsertRequest.input('target_calories_per_day', sql.Int, target_calories_per_day);
        goalInsertRequest.input('start_date', sql.Date, newStartDate);
        goalInsertRequest.input('end_date', sql.Date, newEndDate);

        const insertQuery = `
            INSERT INTO [NutriFit].[goals]
                (goal_id, user_id, goal_type, target_calories_per_day, start_date, end_date)
            VALUES
                (@goal_id, @user_id, @goal_type, @target_calories_per_day, @start_date, @end_date)
        `;

        await goalInsertRequest.query(insertQuery);

        return res.status(201).json({ message: 'Previous goal successfully copied to today' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected Error Occurred' });
    } finally {
        sql.close();
    }
}

export async function getGoalInfo(req, res) {
    try {
        await sql.connect(config);

        // Authenticate user and get user details
        const decodedToken = await authentication(req);
        const userId = decodedToken.sub;

        const userRequest = new sql.Request();
        userRequest.input('user_id', sql.UniqueIdentifier, userId);
        const userQuery = 'SELECT user_id, age, gender, weight, height, activity_level FROM [NutriFit].[user] WHERE user_id = @user_id';
        const userResult = await userRequest.query(userQuery);

        if (!userResult.recordset || userResult.recordset.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const today = new Date().toISOString().split('T')[0];

        const goalRequest = new sql.Request();
        goalRequest.input('user_id', sql.UniqueIdentifier, userId);
        goalRequest.input('start_date', sql.Date, today);
        const goalQuery = `
            SELECT goal_id from [NutriFit].[goals]
            WHERE user_id=@user_id AND start_date=@start_date
        `
        const goalResult = await goalRequest.query(goalQuery);

        if (!goalResult.recordset || goalResult.recordset.length === 0) {
            return res.status(404).json({ error: 'No goals found' });
        }

        return res.status(200).json(goalResult.recordset[0]);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "Unexpected error has occured"});
    } finally {
        sql.close();
    }
}
