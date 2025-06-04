import express from "express"
const router = express.Router()

import { scanBarcodeAPI } from "../controller/barcodeController.js"

router.get("/scanBarcodeAPI", scanBarcodeAPI);

export default router;
