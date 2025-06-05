import express from "express"
const router = express.Router()

import { getFoodDetailFromName } from "../controller/foodSearchController.js";

/*
    Input:
    Body:
    {
        "name": string
    }
*/
// "name": indomie -> Bisa keluar Mie Indomie Goreng
router.get("/getFoodDetailFromName", getFoodDetailFromName);

export default router;
