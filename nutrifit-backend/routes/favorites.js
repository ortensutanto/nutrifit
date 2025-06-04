import express from "express"
const router = express.Router()

import { favoriteRecipe, getUserFavorites, removeFavorite } from "../controller/favoriteController.js"

// Header ada Bearer Token
// Body = recipe_id
router.post("/favoriteRecipe", favoriteRecipe);
router.post("/removeRecipe", favoriteRecipe);

router.get("/getUserFavorites", getUserFavorites);

export default router;

