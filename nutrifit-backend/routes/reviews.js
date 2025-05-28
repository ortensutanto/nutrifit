import express from "express"
const router = express.Router()

import { getReviews, addReviews } from "../controller/reviewController.js";

router.get("/getReviews", getReviews);

router.post("/addReviews", addReviews);

export default router;
