import {createRequire} from "module";
const require = createRequire(import.meta.url);
// Import sql
const sql = require('mssql/msnodesqlv8');
import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv/config"

import { fetch } from "undici";
import { v4 as uuidv4 }from "uuid"
import { isNull } from "util";
import { throws } from "assert";
var request = require("request");

const config = {
    server: ".",
    database: "NutriFit",
    options: {
        trustedConnection: true,
        trustServerCertificate: true,
    },
    driver: "msnodesqlv8"
};

export async function fatSecretAccessToken(req, res) {
    const clientId = 'b7abcedb6e454f3390814c8b9c07dae7'
    const clientSecret = 'fdc6b074f9a046b5a98414f64e332ab6'

    var options = {
        method: 'POST',
        url: 'https://oauth.fatsecret.com/connect/token',
        method: 'POST',
        auth: {
            user: clientId,
            password: clientSecret
        },
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        form: {
            'grant_type': 'client_credentials',
            'scope' : 'basic'
        },
        json: true
    };

    request(options, function(error, response, body) {
        if(error) throw new Error(error);

        console.log(body);
    })
}

// Will change every day
const accessToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwOEFEREZGRjZBNDkxOUFBNDE4QkREQTYwMDcwQzE5NzNDRjMzMUUiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJFSXJkX19ha2tacWtHTDNhWUFjTUdYUFBNeDQifQ.eyJuYmYiOjE3NDg0MDg2MTgsImV4cCI6MTc0ODQ5NTAxOCwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjoiYmFzaWMiLCJjbGllbnRfaWQiOiJiN2FiY2VkYjZlNDU0ZjMzOTA4MTRjOGI5YzA3ZGFlNyIsInNjb3BlIjpbImJhc2ljIl19.atLuRLP0bCSQFifjqMied2AeIeEhcFguBDiCv9-xBWNVqRT0Ovcshe64ztVUE1Rp5XHV-qTCvok2FsN7NHP2uGAKOgkt7GRNGxtKUc18jAooi7Q7Qo2_7O6cTQhVfINBj-DUYNI5hWaRi1TOoalDF4G39_fVfj7dQYbMfJrvATuwmWrdR_L7UJk69LwsJJ_bQ2BifJKJDLN2jO59J_8yObBVs50pkLGJQ6Emxp1VsfyMKnTKzLxdbT4SrWGKs44HjV-OlWV5nZGZ4DenmKOw5qeg8YUqXrx_1ZxD-L6mWfFj-2GRG1p6fpfIWeNsdKX1PHLBO1s3X6rPpUNO5NDdfAlXxPmGn7_ZEfvCWAjHhmJazUmijy_dt9nMpLW6Wgcjxj1YbZ2jDRNEfLYLQ4eWwL2AxjEnLYIDvIj971GZuzRIjbQ4SGhxKcuX8uGNCp8IBAkrx8RCzxs7rr5DG9iq2uOnCepr37_btsbA81j3GOp1GY3aID-Trm6EQvAVlVEvWoOXPn4k-NB84DXX-JV0fcNEWzVADrhIUlymGdWpfWoOrwT8OhrZtOCQ0cm-QwMg5EIUaGkmcwXsO6IoULc4xikwW7B62vXniAKOzXPWWoSCFf-oAc1pE9NYBRoI2L6NxM2RQFHsnbr7HUUlyR6eyec11TzJeWhP78oPtkLFtyQ'

export async function findRecipe(req, res) {
    API_URL = 'https://platform.fatsecret.com/rest/recipes/search/v3'
    var options = {
        method: 'GET',
        url: API_URL,
        headers: {
            'content-type': 'application/json',
            'authorization': accessToken
        },
        json: true
    };
    const response = await fetch(options);
}

async function getIngredientDetails(foodId, servingId) {
    const url = 'https://platform.fatsecret.com/rest/food/v4?format=json&food_id=' + String(foodId);
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${process.env.FATSECRET_ACCESS_TOKEN}`,
            'Accept': 'application/json'
        }
    });
    if(!response.ok) {
        throw new Error('Fetch error:');
    }
    const data = await response.json();
    const servings = data.food.servings.serving;

    // console.log(`Food ID ${foodId}, Serving ID ${servingId}:\n`)
    // console.log(servings);

    let foundServing = null; // Serving in recipe

    for(let i=0; i < servings.length; i++) {
        const tempServing = servings[i];
        if(tempServing.serving_id == servingId) {
            console.log("Serving ID FOUND inside loop: " + tempServing.serving_id);
            foundServing = tempServing;
            break;
        }
    }

    // Bugged servingId
    if(servingId == 0) {
        foundServing = servings[0]
    } 

    if(!foundServing) {
        throw new Error(`Serving ID ${servingId} not found for food ID ${foodId}.`)
    }

    console.log(foundServing);
    console.log(foundServing.calories);

    const foodName = data.food.food_name;
    const calories = Number(foundServing.calories);
    const protein = Number(foundServing.protein) || null;
    const carbohydrate = Number(foundServing.carbohydrate) || null;
    const fat = Number(foundServing.fat) || null;

    return {
        "foodName": foodName,
        "calories": calories,
        "protein": protein,
        "carbohydrates": carbohydrate,
        "fat": fat
    }
}

export async function addRecipe(req, res) {
    let pool;
    let transaction;

    try {
        pool = await sql.connect(config);
        transaction = new sql.Transaction(pool);
        await transaction.begin();

        const recipe = req.body.recipe;
        if(!recipe) {
            await transaction.rollback();
            throw new Error("Missing Recipe Data");
        }

        const {
            number_of_servings,
            serving_sizes,
            preparation_time_min,
            cooking_time_min,
            recipe_name,
            recipe_description,
            directions, // Instructions
            recipe_images,
        } = recipe;
        const newRecipeId = uuidv4();

        // Setting recipe variables
        const serving_size = Number(number_of_servings);
        const recipeCalories = Number(serving_sizes.serving.calories);
        const prepTime = Number(preparation_time_min);
        const cookTime = Number(cooking_time_min);
        
        // Parsing instructions
        const steps = directions?.direction || [];
        const instructionString = steps.map(s => `${s.direction_number}. ${s.direction_description}`).join(' ');
        const imageUrl = recipe_images?.recipe_image?.[0];

        const recipeRequest = new sql.Request(transaction);
        recipeRequest.input('recipe_id', sql.UniqueIdentifier, newRecipeId);
        recipeRequest.input('author_id', sql.UniqueIdentifier, '83d6d048-06ab-41f0-9cdf-0c26e8331aab');
        recipeRequest.input('image_url', sql.VarChar(1000), imageUrl);
        recipeRequest.input('title',             sql.VarChar(255),      recipe_name);
        recipeRequest.input('description',       sql.VarChar(255),      recipe_description);
        recipeRequest.input('serving_size',      sql.Int,               serving_size);
        recipeRequest.input('calories',          sql.Float,             recipeCalories);
        recipeRequest.input('instruction',       sql.VarChar(1000),     instructionString);
        recipeRequest.input('prep_time_minutes', sql.Int,               prepTime);
        recipeRequest.input('cook_time_minutes', sql.Int,               cookTime);
        recipeRequest.input('created_at',        sql.DateTime2,         new Date());

        await recipeRequest.query(`
            INSERT INTO NutriFit.recipes
            (recipe_id, author_id, image_url, title, description,
                serving_size, calories, instruction,
                prep_time_minutes, cook_time_minutes, created_at)
            VALUES
            (@recipe_id, @author_id, @image_url, @title, @description,
                @serving_size, @calories, @instruction,
                @prep_time_minutes, @cook_time_minutes, @created_at)
        `);

        // Grab the ingredients list
        const ingList = recipe.ingredients?.ingredient || [];
        if(!Array.isArray(ingList) || ingList.length === 0) {
            throw new Error("Missing or invalid ingredients list");
        }

        // Loop through ingList and get recipe details 
        for(const ing of ingList) {
            const {
                food_name: name,
                number_of_units,
                measurement_description: unit,
                food_id,                    // optional external ref
                serving_id
            } = ing;   
            // console.log("Food Name " + name);
            // console.log("Food ID " + food_id);
            // console.log("Serving ID " + serving_id);

            const quantity = Number(number_of_units);
            if(isNaN(quantity)) {
                throw new Error(`Invalid quantity of ingredient "${name}"`)
            }

            // Check if ingredient already exists
            // TODO: Add serving type, right now it's just if the ingredient name exists
            const findReq = new sql.Request(transaction);
            findReq.input('name', sql.VarChar(255), name);
            const { recordset: found} = await findReq.query('SELECT food_item_id from NutriFit.food_items WHERE name = @name');

            let foodItemId;
            if(found.length) {
                foodItemId = found[0].food_item_id;
            } else {
                // If not found, find the details then add to database
                foodItemId = uuidv4();
                const ingredientDetails = await getIngredientDetails(food_id, serving_id);
                console.log(ingredientDetails);

                const ingredientRequest = new sql.Request(transaction);
                ingredientRequest.input('food_item_id', sql.UniqueIdentifier, foodItemId);
                ingredientRequest.input('name', sql.VarChar(255), ingredientDetails.foodName);
                ingredientRequest.input('calories', sql.Float, Number(ingredientDetails.calories));
                ingredientRequest.input('protein', sql.Float, Number(ingredientDetails.protein));
                ingredientRequest.input('carbohydrates', sql.Float, Number(ingredientDetails.carbohydrates));
                ingredientRequest.input('fat', sql.Float, Number(ingredientDetails.fat));

                await ingredientRequest.query(`
                    INSERT INTO NutriFit.food_items
                        (food_item_id, name, calories, protein, carbohydrate, fat)
                    VALUES
                        (@food_item_id, @name, @calories, @protein, @carbohydrates, @fat)
                `);
            }
            
            // Create recipe_ingredients table
            const recipeIngredientsRequest = new sql.Request(transaction);
            recipeIngredientsRequest.input('recipe_id', sql.UniqueIdentifier, newRecipeId);
            recipeIngredientsRequest.input('food_item_id', sql.UniqueIdentifier, foodItemId);
            recipeIngredientsRequest.input('quantity', sql.Float, quantity);
            recipeIngredientsRequest.input('unit', sql.VarChar(50), unit);
            await recipeIngredientsRequest.query(`
                INSERT INTO [NutriFit].[recipe_ingredients]
                    (recipe_id, food_item_id, quantity, unit)
                VALUES
                    (@recipe_id, @food_item_id, @quantity, @unit)
                `)
        }

        await transaction.commit();
        return res.json({ body:'Successfuly created recipe'});
    } catch(err) {
        // If there is a transcation, and there was an error. Rollback all the changes
        if (transaction) {
            await transaction.rollback();
        }
        console.error(err);
        return res.status(500).json({ error: err.message || 'Server Error'});
    } finally {
        pool.close();
    }
}

export async function getRecipeDetailsFatSecret(req, res) {
    try {
        const recipeId = req.body.recipe_id;
        const url = 'https://platform.fatsecret.com/rest/food/v2?format=json&food_id=' + String(recipeId);
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${process.env.FATSECRET_ACCESS_TOKEN}`,
                'Accept': 'application/json'
            }
        });

        if(!response) {
            throw new Error("GG");
        }
        const data = await response.json()
        console.log(data);
        return data;
    } catch(err) {
        console.log(err);
    }
}

// Don't use, just do it manually
export async function batchAddRecipe(req, res) {
    try {
        const numberOfRecipes = Number(req.body.recipes.max_results);
        // for(let i = 0; i < numberOfRecipes; i++) {
        for(let i = 0 ; i < 1; i++) {
            const tempRecipe = req.body.recipes.recipe[i];
            const tempRecipeId = tempRecipe.recipe_id;

            const recipe = await getRecipeDetails(tempRecipeId);
            if(!recipe) {
                continue;
            }
            addRecipe(recipe);
        }
    } catch(err) {
        console.log("Err");
    }
}
