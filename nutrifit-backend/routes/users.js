import express from "express"
const router = express.Router()

import argon2 from "argon2"
import { register, getUser, login, editWeight } from "../controller/userController.js";

router.post("/register", register);
router.get("/getUser", getUser);
router.post("/login", login);
router.post("/editWeight", editWeight);

export default router;