import express from "express"
const router = express.Router()

import { getNutritionByDate, addNutrition, getNutritionSummary } from "../controller/nutritionController.js"

router.get("/getNutritionByDate", getNutritionByDate);
router.get("/getNutritionSummary", getNutritionSummary);

router.post("/addNutritionRecipe", addNutrition);

export default router;
