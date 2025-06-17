import { createRequire } from "module";
const require = createRequire(import.meta.url);
// Import mysql
const mysql = require("mysql2");
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv/config";
import { authentication } from "./userController.js";
var request = require("request");

const connectionString = "mysql://root:@localhost:3306/NutriFit";
// const connectionString = "mysql://root:password@localhost:3306/NutriFit";

// Buat menu recipes
export async function getRecipesMenu(req, res) {
  const connection = await mysql.createConnection(connectionString);
  try {
    const [recipes] = await connection.promise().query(
      `SELECT recipe_id, image_url, title, calories FROM NutriFit.recipes
            `
    );

    return res.status(200).json(recipes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  } finally {
    connection.close();
  }
}

export async function getRecipesRecommendationMenu(req, res) {
  try {
    const connection = await mysql.createConnection(connectionString);

    const decodedToken = await authentication(req);
    // Verify user exists
    const userId = decodedToken.sub;
    const userVerification = await connection
      .promise()
      .query("SELECT * FROM NutriFit.user WHERE user_id = ?", [userId]);
    if (!userVerification[0] || userVerification[0].length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const [userReviews] = await connection.promise().query(
      `
            SELECT recipe_id, rating FROM reviews where user_id = ?
            `,
      [userId]
    );

    if (!userReviews[0] || userReviews[0].length === 0) {
      console.log("User has no reviews, returning all recipes");
      return getRecipesMenu(req, res);
    }

    let reviews = {};
    for (let i = 0; i < userReviews.length; i++) {
      reviews[userReviews[i].recipe_id] = userReviews[i].rating;
    }

    // Local dari model.py
    const recommendationUrl = "http://127.0.0.1:5001/recommend";
    var options = {
      method: "POST",
      url: recommendationUrl,
      body: JSON.stringify({ reviews: reviews }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    request(options, async function (error, response, body) {
      if (error) {
        console.error("Error:", error);
      }
      try {
        const recommendations = JSON.parse(body).recommended_recipe_ids;
        try {
          const [recipes] = await connection
            .promise()
            .query(
              `SELECT recipe_id, image_url, title, calories FROM NutriFit.recipes WHERE recipe_id IN (?)`,
              [recommendations]
            );
          return res.status(200).json(recipes);
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: err });
        }
      } catch (parseError) {
        console.error("Parse Error:", parseError);
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}

export async function getRecipes(req, res) {
  try {
    const connection = await mysql.createConnection(connectionString);
    const [recipes] = await connection.promise().query(
      `SELECT r.*, fi.name as ingredient_name 
            FROM NutriFit.recipes r
            LEFT JOIN NutriFit.recipe_ingredients ri ON r.recipe_id = ri.recipe_id
            LEFT JOIN NutriFit.food_items fi ON ri.food_item_id = fi.food_item_id`
    );

    // Group ingredients by recipe
    const recipesMap = new Map();
    recipes.forEach((row) => {
      if (!recipesMap.has(row.recipe_id)) {
        recipesMap.set(row.recipe_id, {
          ...row,
          ingredients: [],
        });
      }
      if (row.ingredient_name) {
        recipesMap.get(row.recipe_id).ingredients.push({
          name: row.ingredient_name,
        });
      }
    });

    return res.json(Array.from(recipesMap.values()));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}

export async function getRecipeById(req, res) {
  try {
    const connection = await mysql.createConnection(connectionString);
    const recipeId = req.query.recipe_id;

    const [recipes] = await connection.promise().query(
      `SELECT r.*, fi.name as ingredient_name, ri.quantity, ri.unit
            FROM NutriFit.recipes r
            LEFT JOIN NutriFit.recipe_ingredients ri ON r.recipe_id = ri.recipe_id
            LEFT JOIN NutriFit.food_items fi ON ri.food_item_id = fi.food_item_id
            WHERE r.recipe_id = ?`,
      [recipeId]
      // Pass kaya http://localhost:3000/recipes/getRecipeId?id=03ECB45B-B620-4134-9051-09FA2D3FD81A
    );

    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Transform the result to include ingredients array
    const recipe = {
      ...recipes[0],
      ingredients: recipes
        .map((row) => ({
          name: row.ingredient_name,
          quantity: row.quantity,
          unit: row.unit,
        }))
        .filter((ing) => ing.name), // Remove null ingredients
    };

    // Remove ingredient fields from main object
    delete recipe.ingredient_name;
    delete recipe.quantity;
    delete recipe.unit;

    return res.json(recipe);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}
