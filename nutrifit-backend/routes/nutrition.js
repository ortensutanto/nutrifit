import express from "express"
const router = express.Router()

import { getNutritionByGoalId, getNutritionByDate, getNutritionSummary, addNutritionFoodItem, addNutritionRecipe } from "../controller/nutritionController.js"

router.get("/getNutritionByDate", getNutritionByDate);
router.get("/getNutritionByGoalId", getNutritionByGoalId);
router.get("/getNutritionSummary", getNutritionSummary);

router.post("/addNutritionFoodItem", addNutritionFoodItem);
router.post("/addNutritionRecipe", addNutritionRecipe);

export default router;
