import express from "express"
const router = express.Router()

import { calculateGoals, copyPreviousGoal, getGoalInfo } from "../controller/goalController.js"

// Input, Header: Bearer userToken
// Body: goal_type (0 (maintain), 1 (lose), 2 (gain)), target_weight_change (Jumlah perubahan: 10 -> 10kg), target_time_week (Waktu perubahan)
router.post("/calculateGoals", calculateGoals);

// Input, Header: Bearer userToken
// Copy goal hari sebelumnya
router.post("/copyPreviousGoal", copyPreviousGoal);

router.get("/getGoalInfo", getGoalInfo);

export default router;
