import express from "express"
const router = express.Router()

import { register, getUser, login, editWeight, getUserData } from "../controller/userController.js";
import { fatSecretAccessToken } from "../controller/createRecipe.js";

router.get("/getUser", getUser);
router.get("/getData", getUserData);

router.post("/register", register);
router.post("/login", login);
router.post("/editWeight", editWeight);

router.post("/fattoken", fatSecretAccessToken);

export default router;
