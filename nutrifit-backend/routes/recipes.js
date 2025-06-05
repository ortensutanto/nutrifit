import express from "express"
const router = express.Router()

import { getRecipes, getRecipeById, getRecipesMenu } from "../controller/recipeController.js";

/*
    Output:
    [
        {
            "recipe_id",
            "image_url",
            "title",
            "calories"
        }, 
        {...}
    ]
*/
router.get("/getRecipesMenu", getRecipesMenu);

/*
    Input:
    API_URL/recipes/getRecipeId?id=03ECB45B-B620-4134-9051-09FA2D3FD81A,
    CONTOH id=<RecipeId> 

    Output:
    {
        "recipe_id",
        "author_id",
        "image_url",
        "title",
        "description",
        "serving_size",
        "calories",
        "instruction",
        "prep_time_minutes",
        "cook_time_minutes",
        "created_at": datetime,
        "ingredients": [
            {
                "name",
                "quantity",
                "unit"
            }
        ]
    }
*/
router.get("/getRecipeId", getRecipeById);

router.get("/getRecipes", getRecipes);

export default router;
