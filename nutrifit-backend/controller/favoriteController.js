import { createRequire } from "module";
const require = createRequire(import.meta.url);
// Import mysql
const mysql = require('mysql2');
import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv/config"
import { v4 as uuidv4 } from "uuid"
import { authentication } from "./userController.js";

const connectionString = "mysql://root:@localhost:3306/NutriFit";

export async function favoriteRecipe(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const recipeId = req.body.recipe_id;
        const decodedToken = await authentication(req);

        // Verify user exists
        const userId = decodedToken.sub;
        const userVerification = await connection.promise().query(
            'SELECT * FROM NutriFit.user WHERE user_id = ?',
            [userId]
        );
        if (!userVerification[0] || userVerification[0].length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Add to favorites
        await connection.promise().query(
            `INSERT INTO NutriFit.user_favorites 
                (favorite_id, user_id, recipe_id)
            VALUES (?, ?, ?)`,
            [
                uuidv4(),
                userId,
                recipeId
            ]
        );
        return res.status(201).json({ body: 'Recipe favorited' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something unexpected happened' });
    }
}

export async function getUserFavorites(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const decodedToken = await authentication(req);

        const userId = decodedToken.sub;
        const userVerification = await connection.promise().query(
            'SELECT * FROM NutriFit.user WHERE user_id = ?',
            [userId]
        );
        if (!userVerification[0] || userVerification[0].length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const [favorites] = await connection.promise().query(
            'SELECT recipe_id FROM NutriFit.user_favorites WHERE user_id = ?',
            [userId]
        );
        if (!favorites[0] || favorites[0].length === 0) {
            return res.status(404).json({ body: 'User has no favorites' });
        }

        return res.status(200).json({ favorites: favorites[0] })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something unexpected happened' });
    }
}

export async function removeFavorite(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        await connection.promise().query(
            'DELETE FROM NutriFit.user_favorites WHERE user_id = ? AND recipe_id = ?',
            [req.body.user_id, req.body.recipe_id]
        );

        return res.status(200).json({ message: 'Recipe removed from favorites successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}
