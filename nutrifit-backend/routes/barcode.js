import express from "express"
const router = express.Router()

import { scanBarcodeAPI } from "../controller/barcodeController.js"

/*
    Input:
    Header:
        Authorization: Bearer <JWToken>
    Body:
        {
            "upc_barcode": "<string>" // The barcode to scan, e.g., "737628064502"
        }

    Output:
    Success (200):
        {
            "food_item_id": "<string>",
            "barcodeScan": "<string>",
            "name": "<string>",
            "calories": <number>,
            "protein": <number>,
            "carbohydrate": <number>,
            "fat": <number>
        }

    Error (400): { "error": "Barcode not provided" }
    Error (404): { "error": "Product not found on Open Food Facts API" }
    Error (500): { "error": "<error message from server or Open Food Facts API>" }
*/

router.get("/scanBarcodeAPI", scanBarcodeAPI);

export default router;
