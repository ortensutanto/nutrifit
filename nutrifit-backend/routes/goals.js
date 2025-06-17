import express from "express"
const router = express.Router()

import { calculateGoals, copyPreviousGoal, getGoalInfo, getCalorieNeeded, getTodayGoal } from "../controller/goalController.js"

// Input, Header: Bearer userToken
// Body: 
// goal_type (0 (maintain), 1 (lose), 2 (gain))
// target_weight_change (Jumlah perubahan: 10 -> 10kg)
// target_time_week (Waktu perubahan)
router.post("/calculateGoals", calculateGoals);

// Copy goal hari sebelumnya
// Input
// Header: Bearer <JWToken> 
router.post("/copyPreviousGoal", copyPreviousGoal);

/*
    Input:
    Header:
        Authorization: Bearer <JWToken>
    
    Output:
    datetime: 2025-06-04T17:00:00.000Z
    {
        "data": [
            {
                "goal_id": string,
                "user_id": string,
                "goal_type": int,
                "target_calories_per_day": int,
                "start_date": datetime,
                "end_date": datetime
            }
        ]
    }
*/
router.get("/getGoalInfo", getGoalInfo);

/*
    Input:
    Header:
        Authorization: Bearer <JWToken>
    Body:
        "goal_id"

    Output:
    {
        "goal_calories",
        "consumed_calories",
        "calories_deficit"
    }
*/
router.get("/getCalorieNeeded", getCalorieNeeded);

router.get("/getTodayGoal", getTodayGoal); // Alias for getGoalInfo to retrieve today's goal

export default router;
