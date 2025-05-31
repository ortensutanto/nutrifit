import express from "express"
const router = express.Router()

import { calculateGoals } from "../controller/goalController.js"

router.post("/calculateGoals", calculateGoals);

export default router;
