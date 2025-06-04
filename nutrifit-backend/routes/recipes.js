import express from "express"
const router = express.Router()

import { getRecipes, getRecipeById } from "../controller/recipeController.js";
router.get("/getRecipes", getRecipes);
router.get("/getRecipeId", getRecipeById);

export default router;
