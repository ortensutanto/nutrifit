import express from "express"
const router = express.Router()

import { addNutritionRecipe, addNutritionFoodItem, getNutritionLogs } from "../controller/nutritionController.js"

router.get("/getNutritionLogs", getNutritionLogs);

router.post("/addNutritionRecipe", addNutritionRecipe);
router.post("/addNutritionFoodItem", addNutritionFoodItem);

export default router;
