import {createRequire} from "module";
const require = createRequire(import.meta.url);
// Import sql
const sql = require('mssql/msnodesqlv8');
import jsonwebtoken from "jsonwebtoken"
import { authentication } from "./userController.js";

const config = {
    server: ".",
    database: "NutriFit",
    options: {
        trustedConnection: true,
        trustServerCertificate: true,
    },
    driver: "msnodesqlv8"
};

export async function favoriteRecipe(req, res) {
    try {
        await sql.connect(config);
        const recipeId = req.body.recipe_id;
        const decodedToken = await authentication(req);

        // Verify user exists
        const userId = decodedToken.sub;
        const userVerification = new sql.Request();
        userVerification.input('user_id', sql.UniqueIdentifier, userId);
        const userQuery = 'SELECT * FROM [NutriFit].[user] WHERE user_id = @user_id';
        const userResult = await userVerification.query(userQuery);
        if(!userResult.recordset || userResult.recordset.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Add to favorites
        const favoriteRequest = new sql.Request();
        favoriteRequest.input('user_id', sql.UniqueIdentifier, userId);
        favoriteRequest.input('recipe_id', sql.UniqueIdentifier, recipeId);
        const favoriteQuery = `
            INSERT INTO [NutriFit].[user_favorites]
                (user_id, recipe_id)
            VALUES
                (@user_id, @recipe_id)
        ` 
        const favoriteResult = await favoriteRequest.query(favoriteQuery);
        return res.status(201).json({ body:'Recipe favorited'});
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error:'Something unexpected happened'});
    } finally {
        sql.close();
    }
}

export async function getUserFavorites(req, res) {
    try {
        await sql.connect(config);
        const decodedToken = await authentication(req);
        
        const userId = decodedToken.sub;
        const userVerification = new sql.Request();
        userVerification.input('user_id', sql.UniqueIdentifier, userId);
        const userQuery = 'SELECT * FROM [NutriFit].[user] WHERE user_id = @user_id';
        const userResult = await userVerification.query(userQuery);
        if(!userResult.recordset || userResult.recordset.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const favoriteRequest = new sql.Request();
        favoriteRequest.input('user_id', sql.UniqueIdentifier, userId);
        const favoriteQuery = `
            SELECT recipe_id FROM [NutriFit].[user_favorites] WHERE user_id = @user_id 
        `
        const favoriteResult = await favoriteRequest.query(favoriteQuery);
        if(!favoriteResult.recordset || favoriteResult.recordset.length === 0) {
            return res.status(404).json({ body: 'User has no favorites'});
        }

        return res.status(200).json({ favorites: favoriteResult.recordset})
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error:'Something unexpected happened'});
    } finally {
        sql.close();
    }
}
