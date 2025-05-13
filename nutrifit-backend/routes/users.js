import express from "express"
const router = express.Router()

import argon2 from "argon2"
import { register, getUser } from "../controller/userController.js";

router.post("/register", register);
router.get("/getUser", getUser);

export default router;