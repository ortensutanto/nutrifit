import {createRequire} from "module";
const require = createRequire(import.meta.url);
// Import sql
const sql = require('mssql/msnodesqlv8');
import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv/config"
import { v4 as uuidv4 } from "uuid"

const config = {
    server: ".",
    database: "NutriFit",
    options: {
        trustedConnection: true,
        trustServerCertificate: true,
    },
    driver: "msnodesqlv8"
};

export async function getReviews(req, res) {
    try {
        await sql.connect(config);
        const request = new sql.Request(); 
        request.input('recipe_id', sql.UniqueIdentifier, req.body.recipe_id);
        const query = 'SELECT * FROM [NutriFit].[reviews] WHERE recipe_id = @recipe_id';
        await request.query(query);

        return res.status(200).json({data: request.recordset});
    } catch(err) {
        console.error(err);
        return res.status(500).json({error: 'Unexpected error occured'});
    } finally {
        sql.close();
    }
}

export async function addReviews(req, res) {
    try {
        await sql.connect(config);
        const request = new sql.Request(); 
        request.input('review_id', sql.UniqueIdentifier, uuidv4());
        request.input('recipe_id', sql.UniqueIdentifier, req.body.recipe_id);
        request.input('user_id', sql.UniqueIdentifier, req.body.user_id);
        request.input('rating', sql.Int, req.body.rating);
        request.input('comment', sql.VarChar(255), req.body.comment);
        request.input('created_at', sql.Date, new Date());

        const query = `
        INSERT INTO [NutriFit].[reviews] 
            (review_id, recipe_id, user_id, rating, comment, created_at)
        VALUES
            (@review_id, @recipe_id, @user_id, @rating, @comment, @created_at)`
        const response = await request.query(query);

        return res.status(200).json({data: request.recordset});
    } catch(err) {
        console.error(err);
        return res.status(500).json({error: 'Unexpected error occured'});
    } finally {
        sql.close();
    }
}
