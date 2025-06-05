import express from "express"
const router = express.Router()

import { favoriteRecipe, getUserFavorites, removeFavorite } from "../controller/favoriteController.js"

/*
    Input:
    Header:
        Authorization: Bearer <JWToken>
    Body:
        {
            "recipe_id": "<string>"
        }

    Output:
        Status 201: { "body": "Recipe favorited" }

        Errors:
        Status 400: { "error": "User not found" }
        Status 500: { "error": "Something unexpected happened" }
*/
router.post("/favoriteRecipe", favoriteRecipe);

/*
    Input:
    Body:
        {
            "recipe_id": "<string>"
        }

    Output:
        Status 200: { "message": "Recipe removed from favorites successfully" }

        Errors:
        Status 500: { "error": "Unexpected error occurred" }
*/
router.delete("/removeFavorite", removeFavorite);

/*
    Input:
    Header:
        Authorization: Bearer <JWToken>

    Output:
        Status 200:
        {
            "favorites": [
                {
                    "recipe_id": "<string>"
                },
                ...
            ]
        }

        Errors:
        Status 400: { "error": "User not found" }

        Status 404: { "body": "User has no favorites" }
        Status 500: { "error": "Something unexpected happened" }
*/
router.get("/getUserFavorites", getUserFavorites);

export default router;

