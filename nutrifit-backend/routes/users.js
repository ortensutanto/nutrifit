import express from "express"
const router = express.Router()

import argon2 from "argon2"
import { register, getUser, login, editWeight, getData } from "../controller/userController.js";

router.get("/getUser", getUser);
router.get("/getData", getData);

router.post("/register", register);
router.post("/login", login);
router.post("/editWeight", editWeight);

export default router;