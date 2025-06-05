import express from "express"
const router = express.Router()

import { getNutritionByGoalId, getNutritionByDate, getNutritionSummary, addNutritionFoodItem, addNutritionRecipe } from "../controller/nutritionController.js"

/*
    Input:
    Header:
        Authorization: Bearer <JWToken>
    Body:
        {
            "date": "YYYY-MM-DD"
        }

    Output:
    {
        "data": [
            {
                "entry_id": "<string>",
                "user_id": "<string>",
                "food_item_id": "<string|null>",
                "recipe_id": "<string|null>",
                "quantity": <number>,
                "timestamp": "<timestamp>",
                "goal_id": "<string>"
            },
            ...
        ]
    }
*/
router.get("/getNutritionByDate", getNutritionByDate);


/*
    Input:
    Header:
        Authorization: Bearer <JWToken>
    Body:
        {
            "goal_id": "<string>"
        }

    Output:
    {
        "data": [
            {
                "entry_id": "<string>",
                "user_id": "<string>",
                "food_item_id": "<string|null>",
                "recipe_id": "<string|null>",
                "quantity": <number>,
                "timestamp": "<timestamp>",
                "goal_id": "<string>"
            },
            ...
        ]
    }
*/
router.get("/getNutritionByGoalId", getNutritionByGoalId);

/*
    Input:
    Header:
        Authorization: Bearer <JWToken>
    Body:
        {
            "goal_id": "<string>"
        }

    Output:
    {
        "data": [
            {
                "food_item_id": "<string|null>",
                "recipe_id": "<string|null>",
                "quantity": <number>
            },
            ...
        ],
        "calories": <number>
    }

    Error Output (missing goal_id):
    {
        "error": "Goal Id not provided"
    }
*/
router.get("/getNutritionSummary", getNutritionSummary);

/*
    Input:
    Header:
        Authorization: Bearer <JWToken>
    Body:
        {
            "food_item_id": "<string>",
            "quantity": <number>,
            "goal_id": "<string>"
        }

    Output:
    {
        "message": "Nutrition log added successfully"
    }
*/
router.post("/addNutritionFoodItem", addNutritionFoodItem);

/*
    Input:
    Header:
        Authorization: Bearer <JWToken>
    Body:
        {
            "recipe_id": "<string>",
            "quantity": <number>,
            "goal_id": "<string>"
        }

    Output:
    {
        "message": "Nutrition log added successfully"
    }
*/
router.post("/addNutritionRecipe", addNutritionRecipe);

export default router;
