import { createRequire } from "module";
const require = createRequire(import.meta.url);
// Import mysql
const mysql = require('mysql2');
import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv/config"
import { v4 as uuidv4 } from "uuid"
import { authentication } from "./userController.js";

const connectionString = "mysql://root:password@localhost:3306/NutriFit";
// const connectionString = "mysql://root:@localhost:3306/NutriFit";

export async function favoriteRecipe(req, res) {
  try {
    const connection = await mysql.createConnection(connectionString);
    const recipeId = req.body.recipe_id;
    const decodedToken = await authentication(req);

    const userId = decodedToken.sub;

    // Cek apakah user valid
    const [userVerification] = await connection.promise().query(
      'SELECT * FROM NutriFit.user WHERE user_id = ?',
      [userId]
    );
    if (!userVerification || userVerification.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    // ✅ Cek dulu apakah kombinasi user_id dan recipe_id sudah ada
    const [existingFavorite] = await connection.promise().query(
      'SELECT * FROM NutriFit.user_favorites WHERE user_id = ? AND recipe_id = ?',
      [userId, recipeId]
    );

    if (existingFavorite.length > 0) {
      return res.status(200).json({ body: 'Recipe already favorited' });
    }

    // 🚀 Jika belum, baru insert
    await connection.promise().query(
      `INSERT INTO NutriFit.user_favorites (user_id, recipe_id) VALUES (?, ?)`,
      [userId, recipeId]
    );

    return res.status(201).json({ body: 'Recipe favorited' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something unexpected happened' });
  }
}

export async function getUserFavorites(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const decodedToken = await authentication(req);

        const userId = decodedToken.sub;

        const [userVerification] = await connection.promise().query(
            'SELECT * FROM NutriFit.user WHERE user_id = ?',
            [userId]
        );
        if (!userVerification || userVerification.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const [favorites] = await connection.promise().query(
            `SELECT 
                r.recipe_id, 
                r.title, 
                r.image_url 
            FROM NutriFit.user_favorites uf
            JOIN NutriFit.recipes r ON uf.recipe_id = r.recipe_id
            WHERE uf.user_id = ?`,
            [userId]
        );

        if (!favorites || favorites.length === 0) {
            return res.status(404).json({ body: 'User has no favorites' });
        }

        return res.status(200).json({ favorites });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something unexpected happened' });
    }
}


export async function removeFavorite(req, res) {
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

        await connection.promise().query(
            'DELETE FROM NutriFit.user_favorites WHERE user_id = ? AND recipe_id = ?',
            [userId, req.body.recipe_id]
        );

        return res.status(200).json({ message: 'Recipe removed from favorites successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}
