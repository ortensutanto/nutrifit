import express from "express"
const router = express.Router()

import { getFoodDetailFromName, getFoodDetailFromId } from "../controller/foodSearchController.js";

/*
    Input:
    Body:
    {
        "name": string
    }
*/
// "name": indomie -> Bisa keluar Mie Indomie Goreng
router.get("/getFoodDetailFromName", getFoodDetailFromName);

routert.get("/getFoodDetailFromId", getFoodDetailFromId);

export default router;
