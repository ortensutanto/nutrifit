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

// Add to nutrition
// CUMA BOLEH SALAH SATU RECIPE || FOOD ITEM

export async function addNutritionRecipe(req, res) {
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

        const nutritionRequest = new sql.Request();
        const entryId = uuidv4();
        nutritionRequest.input('entry_id', sql.UniqueIdentifier, entryId);
        nutritionRequest.input('user_id', sql.UniqueIdentifier, userId);
        nutritionRequest.input('recipe_id', sql.UniqueIdentifier, req.body.recipe_id);
        nutritionRequest.input('quantity', sql.Int, req.body.quantity);
        nutritionRequest.input('timestamp', sql.DateTime, new Date());
        nutritionRequest.input('goal_id', sql.UniqueIdentifier, req.body.goal_id);
        const nutritionQuery = `
            INSERT INTO [NutriFit].[nutrition_logs]
                (entry_id, user_id, quantity, timestamp, recipe_id, goal_id)
            VALUES
                (@entry_id, @user_id, @quantity, @timestamp, @recipe_id, @goal_id)
        `
        const nutritionResult = nutritionRequest.query(nutritionQuery);
        return res.status(201).json({body: "Successfully Added Recipe To Nutrition Log"});
    } catch(err) {
        return res.status(500).json({err: "Unexpected error has occured"});
    } finally {
        sql.close();
    }
}

export async function addNutritionFoodItem(req, res) {
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

        const nutritionRequest = new sql.Request();
        const entryId = uuidv4();
        nutritionRequest.input('entry_id', sql.UniqueIdentifier, entryId);
        nutritionRequest.input('user_id', sql.UniqueIdentifier, userId);
        nutritionRequest.input('food_item_id', sql.UniqueIdentifier, req.body.food_item_id);
        nutritionRequest.input('quantity', sql.Int, req.body.quantity);
        nutritionRequest.input('timestamp', sql.DateTime, new Date());
        nutritionRequest.input('goal_id', sql.UniqueIdentifier, req.body.goal_id);
        const nutritionQuery = `
            INSERT INTO [NutriFit].[nutrition_logs]
                (entry_id, user_id, quantity, timestamp, recipe_id, goal_id)
            VALUES
                (@entry_id, @user_id, @quantity, @timestamp, @recipe_id, @goal_id)
        `
        const nutritionResult = nutritionRequest.query(nutritionQuery);
        return res.status(201).json({body: "Successfully Added Food Item To Nutrition Log"});
    } catch(err) {
        return res.status(500).json({err: "Unexpected error has occured"});
    } finally {
        sql.close();
    }
}

export async function getNutritionLogs(req, res) {
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

        const nutritionRequest = new sql.Request();
        // Test params first
        nutritionRequest.input('user_id', sql.UniqueIdentifier, userId);
        nutritionRequest.input('goal_id', sql.UniqueIdentifier, req.query.goal_id);
        const nutritionQuery = `
        SELECT * FROM [NutriFit].[nutrition_logs] WHERE user_id=@user_id AND goal_id=@goal_id
        `
        const nutritionResult = await nutritionRequest.query(nutritionQuery);
        return res.status(200).json(nutritionResult.recordsets)
    } catch(err) {
        console.log(err);
        return res.status(500).json({err: "Unexpected error has occured"});
    } finally {
        sql.close();
    }
}
