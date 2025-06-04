import { createRequire } from "module";
const require = createRequire(import.meta.url);
// Import mysql
const mysql = require('mysql2');
import { authentication } from "./userController.js";

const connectionString = "mysql://root:@localhost:3306/NutriFit";

export async function getFoodDetailFromName(req, res) {
    const connection = await mysql.createConnection(connectionString);
    try {
        const [foodDetails] = await connection.promise().query(
            `
            SELECT * FROM NutriFit.food_items WHERE name=?
            `,
            [req.body.name]
        );
        return res.status(200).json(foodDetails);
    } catch(err) {
        console.error(err);
        return res.status(500).json({error: "Unexpected Error Occured"});
    }
}
