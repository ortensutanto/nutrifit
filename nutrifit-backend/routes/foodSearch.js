import express from "express"
const router = express.Router()

import { getFoodDetailFromName } from "../controller/foodSearchController.js";

router.get("/getFoodDetailFromName", getFoodDetailFromName);

export default router;
