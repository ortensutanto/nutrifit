import express from "express"
const router = express.Router()

import { fatSecretAccessToken, addRecipe, batchAddRecipe } from "../controller/createRecipe.js";

// Gausah dipake
// Cuma panggil dari API

router.post("/addRecipe", addRecipe);
router.post("/fattoken", fatSecretAccessToken);

router.post("/batchAddRecipe", batchAddRecipe);
// router.get("/getRecipeDetails", getRecipeDetails);

export default router;
