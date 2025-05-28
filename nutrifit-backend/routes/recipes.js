import express from "express"
const router = express.Router()

import { getRecipeDetails } from "../controller/recipeController.js";
router.get("/getRecipeDetails", getRecipeDetails);

export default router;
