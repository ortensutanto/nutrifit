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
        await sql.connect(config);

        const request = new sql.Request();
        request.input('recipe_id', req.body.recipe_id);
        const recipeQuery = 'SELECT * FROM [NutriFit].[recipes] WHERE recipe_id = @recipe_id LEFT JOIN [NutriFit].[recipe_ingredients]';
        await request.query(recipeQuery);

        return res.status(200).json({ data:request.recordset });
    } catch(err) {
        console.error(err);
        return res.status(500).json({error: 'Unexpected error occured'});
    } finally {
        sql.close();
    }
}

// export async function getRecipes(req, res) {
//     try {
//         await sql.connect(config);
//         
//         const request = new sql.Request();
//
//     }
// }
