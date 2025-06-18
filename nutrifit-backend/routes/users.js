import express from "express"
const router = express.Router()

import { register, getUser, login, editWeight, editAge, editGender, editHeight, editDisplayName, getUserData, changePassword } from "../controller/userController.js";
import { fatSecretAccessToken } from "../controller/createRecipe.js";

router.get("/getUser", getUser);


/*
    Input:
    Di Header
    Authorization: Bearer <jwt_token>

    Output:
    "data": [
        {
            "email",
            "display_name",
            "age",
            "gender",
            "weight",
            "height",
            "activity_level"
        }
    ]
*/
router.get("/getData", getUserData);

/*
    Input:
    "email",
    "password",
    "display_name",
    "age",
    "gender": 0 or 1,
    "weight",
    "height",
    "activity_level": 1 (Very Low) - 5 (Very High)

    Output:
    201 Success,
    400 Input Missing,
    500 Unexpected error
*/
router.post("/register", register);

/*
    Input:
    "email": ...,
    "password": ...

    Output:
    "token": "jwt_token"
*/
router.post("/login", login);

/*
    editWeight

    Input:
    "weight": ...

    Output:
    "message": "Weight updated successfully"
    
*/
router.post("/editWeight", editWeight);
router.post("/editAge", editAge);
router.post("/editGender", editGender);
router.post("/editHeight", editHeight);
router.post("/editDisplayName", editDisplayName);
router.post("/changePassword", changePassword);

export default router;
