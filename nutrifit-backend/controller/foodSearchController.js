import { createRequire } from "module";
const require = createRequire(import.meta.url);
// Import mysql
const mysql = require("mysql2");
import { authentication } from "./userController.js";

// const connectionString = "mysql://root:password@localhost:3306/NutriFit";
const connectionString = "mysql://root@localhost:3306/NutriFit";

export async function getFoodDetailFromName(req, res) {
  const connection = await mysql.createConnection(connectionString);
  try {
    const name = req.query.name;

    if (!name) {
      return res.status(400).json({ error: 'Missing "name" query parameter' });
    }

    const searchTerm = `%${name}%`;

    const [foodDetails] = await connection.promise().query(
      `
            SELECT * FROM NutriFit.food_items WHERE name LIKE ?
            `,
      [searchTerm]
    );
    return res.status(200).json(foodDetails);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unexpected Error Occured" });
  } finally {
      await connection.end();
  }
}

export async function getFoodDetailFromId(req, res) {
    const connection = await mysql.createConnection(connectionString);
    try {
        const foodId = req.query.food_item_id;
        
        if (!foodId) {
            return res.status(400).json({ error: 'Missing "id" query parameter' });
        }

        const [foodDetails] = await connection.promise().query(
            `
            SELECT * FROM NutriFit.food_items WHERE food_item_id = ?
            `,
            [foodId]
        );
        return res.status(200).json(foodDetails);
    } catch(err) {
        console.error(err);
        return res.status(500).json({error: "Unexpected Error Occured"});
    } finally {
      await connection.end();
    }
}
