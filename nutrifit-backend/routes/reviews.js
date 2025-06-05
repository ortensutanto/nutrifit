import express from "express"
const router = express.Router()

import { getReviews, addReviews } from "../controller/reviewController.js";

/*
    Input:
    Header:
        None
    Body:
        {
            "recipe_id": "<string>"
        }

    Output:
    {
        "data": [
            {
                "review_id": "<string>",
                "recipe_id": "<string>",
                "user_id": "<string>",
                "rating": <number>,
                "comment": "<string>",
                "created_at": "<timestamp>"
            },
            ...
        ]
    }
*/
router.get("/getReviews", getReviews);

/*
    Input:
    Header:
        Authorization: Bearer <JWToken>
    Body:
        {
            "recipe_id": "<string>",
            "rating": <number>,
            "comment": "<string>"
        }

    Output:
    {
        "message": "Review added successfully"
    }

    Error Output (example when user not found):
    {
        "error": "User not found"
    }
*/
router.post("/addReviews", addReviews);

export default router;
