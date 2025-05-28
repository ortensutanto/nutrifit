import {createRequire} from "module";
const require = createRequire(import.meta.url);
// Import sql
const sql = require('mssql/msnodesqlv8');
import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv/config"

const config = {
    server: ".",
    database: "NutriFit",
    options: {
        trustedConnection: true,
        trustServerCertificate: true,
    },
    driver: "msnodesqlv8"
};

export async function getRecipeDetails(req, res) {
    try {
        const recipeId = req.query.recipe_id;
        if(!recipeId) {
            return res.status(400).json({ error: "Missing recipe_id in query"});
        }

        await sql.connect(config);

        const request = new sql.Request();
        request.input('recipe_id', recipeId);

        const recipeQuery = `
            SELECT r.recipe_id, r.title, r.description, r.image_url, r.serving_size, r.calories, r.instruction,
            r.prep_time_minutes, r.cook_time_minutes, r.created_at, fi.food_item_id, fi.name
            FROM [NutriFit].[Recipes] r
            LEFT JOIN [NutriFit].[recipe_ingredients] ri ON r.recipe_id = ri.recipe_id
            LEFT JOIN [NutriFit].[food_items] fi ON ri.food_item_id = fi.food_item_id
            WHERE r.recipe_id =  @recipe_id
        `;
        const result = await request.query(recipeQuery);
        const rows = result.recordset;

        if(rows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found'});
        }

        // Query kasih info recipe berulang kali
        const recipe = {
            recipe_id: rows[0].recipe_id,
            title: rows[0].title,
            description: rows[0].description,
            image_url: rows[0].image_url,
            serving_size: rows[0].serving_size,
            calories: rows[0].calories,
            instruction: rows[0].instruction,
            prep_time_minutes: rows[0].prep_time_minutes,
            cook_time_minutes: rows[0].cook_time_minutes,
            created_at: rows[0].created_at,
            ingredients: []
        };

        for(const row of rows) {
            recipe.ingredients.push({
                food_item_id: row.food_item_id,
                name: row.name
            })
        }

        return res.status(200).json(recipe);
    } catch(err) {
        console.error(err);
        return res.status(500).json({error: 'Unexpected error occured'});
    } finally {
        sql.close();
    }
}
