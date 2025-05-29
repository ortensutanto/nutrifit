import express from "express"
const router = express.Router()

import { favoriteRecipe } from "../controller/favoriteController.js"

// Header ada Bearer Token
// Body = recipe_id
router.post("/favoriteRecipe", favoriteRecipe);

export default router;

