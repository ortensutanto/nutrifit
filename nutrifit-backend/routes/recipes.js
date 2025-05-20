import express from "express"
const router = express.Router()

import { fatSecretAccessToken, addRecipe, testSingleJSON, getIngredientDetails } from "../controller/createRecipe.js";

router.get("/findIngredient", getIngredientDetails);

router.post("/addRecipe", addRecipe);
router.post("/fattoken", fatSecretAccessToken);

router.post("/testJSON", testSingleJSON);

export default router;
