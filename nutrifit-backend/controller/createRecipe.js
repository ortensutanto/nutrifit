import {createRequire} from "module";
const require = createRequire(import.meta.url);
// Import sql
const sql = require('mssql/msnodesqlv8');
import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv/config"

import { fetch } from "undici";
import { v4 as uuidv4 }from "uuid"
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
const accessToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwOEFEREZGRjZBNDkxOUFBNDE4QkREQTYwMDcwQzE5NzNDRjMzMUUiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJFSXJkX19ha2tacWtHTDNhWUFjTUdYUFBNeDQifQ.eyJuYmYiOjE3NDc3MTM1ODEsImV4cCI6MTc0Nzc5OTk4MSwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjoiYmFzaWMiLCJjbGllbnRfaWQiOiJiN2FiY2VkYjZlNDU0ZjMzOTA4MTRjOGI5YzA3ZGFlNyIsInNjb3BlIjpbImJhc2ljIl19.UdegWnLcGaxHeTnVk4SyCT69rX83ilyKB1kVT2fnDA6434eApiK6Nghvi5Hf_NLlxzxKk1LI0hKzk_cG8zXU_JwbFjJBk7XV97NH1FqkHoaMOA8yTQ7nPoTb86tPGW4ykLwJ7ZqaULlsf2Q7ThzzW4xoeqD7sH9tjIULjsS2O1KAlrg1pyN3ZULYpiN6rHIBDUcNiDR6HdD-HxqRvr3N88IgbHAbnPsO5BHG_lHeAEGlzyUaEeX-IlxMprpk8xrSd7RqAruLxU5TtnodfvqlfHJF2N_lfriMlhWfWQe-vSdvGAdHA7gLycCw7vazweQggw7aRMy5LEj75xCE6uGos-MhB__IaheHAiF8CqbErDdIRJjlxR-Pzol40eQP88xpeGVLQBZJs9as9go8u1uwi_u_hQZDc9CtfBb0aUs4Www1rL0yHdT7WbrrvUYqjW7n4zqOeV84NPF3r2g3GCCjCWK96FQ3CUDa6_8Bn2x9RbGOni8Z-NWCiuFsHg2EakbOs1fvhgucCGf2_8vK4wFdDB8iCO9Zcvh6lDmkRd-m5t6RqAucMGQOPRHX1gERsavnwK6ldqvr_Sg3VYzqc1PWRTq0RlxsuXzlfbU95WWdnoeB8KkTXYv3XlaH4eLHqbNGBat9XIhm3U-EB-1XsxwbVu5rttaCHd1r4HHffhDatpk'

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
    const servings = data.food.servings;
    let foundServing = null; // Serving in recipe
    
    for(let i=0; i < servings.length; i++) {
        const tempServing = servings[i];
        if(tempServing.serving_id == servingId) {
            foundServing = tempServing;
            break;
        }
    }
    
    if(foundServing == null) {
        throw new Error('Serving ID not found');
    }

    // Ga tambahin serving dll, terlalu ribet kayanya
    const foodName = data.food.food_name;
    const calories = Number(foundServing.calories);
    const protein = Number(foundServing.protein) || null;
    const carbohydrate = Number(foundServing.carbohydrate) || null;
    const fat = Number(foundServing.fat) || null;

    return {
        "foodName": foodName,
        "calories": calories,
        "protein": protein,
        "carbohydrate": carbohydrate,
        "fat": fat
    }
}

export async function testSingleJSON(req, res) {
  let pool;
  let transaction;

  try {
    // 1) Connect & begin transaction
    pool = await sql.connect(config);
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    const recipe = req.body.recipe;
    if (!recipe) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Missing recipe data' });
    }

    // 2) Validate required recipe‐level fields
    const {
      number_of_servings: nsRaw,
      serving_sizes,
      preparation_time_min: prepRaw,
      cooking_time_min: cookRaw,
      recipe_name,
      recipe_description,
      directions,
      recipe_images,
      ingredients
    } = recipe;

    // Basic numeric checks
    const calRaw = serving_sizes?.serving?.calories;
    if (!nsRaw || isNaN(+nsRaw)) {
      throw new Error('Invalid or missing number_of_servings');
    }
    if (!calRaw || isNaN(+calRaw)) {
      throw new Error('Invalid or missing serving_sizes.serving.calories');
    }
    if (!prepRaw || isNaN(+prepRaw)) {
      throw new Error('Invalid or missing preparation_time_min');
    }
    if (!cookRaw || isNaN(+cookRaw)) {
      throw new Error('Invalid or missing cooking_time_min');
    }

    // // Validate ingredients array
    // if (!Array.isArray(ingredients) || ingredients.length === 0) {
    //   throw new Error('Missing or invalid ingredients list');
    // }
    // for (const ing of ingredients) {
    //   if (!ing.name || !ing.quantity || !ing.unit) {
    //     throw new Error('Each ingredient must have name, quantity, and unit');
    //   }
    // }

    // 3) Compute derived values
    const serving_size = parseInt(nsRaw, 10);
    const calories     = serving_size * Number(calRaw);
    const prepTime     = parseInt(prepRaw, 10);
    const cookTime     = parseInt(cookRaw, 10);

    // 4) Build instruction string
    const steps = directions?.direction || [];
    const instructionString = steps
      .map(s => `${s.direction_number}. ${s.direction_description}`)
      .join(' ');

    // 5) Choose image URL
    const imageUrl =
      recipe_images?.recipe_image?.[0] ||
      recipe.recipe_image ||
      null;

    // 6) Insert recipe
    const txRequest = new sql.Request(transaction);
    const newRecipeId = uuidv4();
    txRequest.input('recipe_id',         sql.UniqueIdentifier, newRecipeId);
    txRequest.input('author_id',         sql.UniqueIdentifier, '83d6d048-06ab-41f0-9cdf-0c26e8331aab');
    txRequest.input('image_url',         sql.VarChar(1000),     imageUrl);
    txRequest.input('title',             sql.VarChar(255),      recipe_name);
    txRequest.input('description',       sql.VarChar(255),      recipe_description);
    txRequest.input('serving_size',      sql.Int,               serving_size);
    txRequest.input('calories',          sql.Float,             calories);
    txRequest.input('instruction',       sql.VarChar(1000),     instructionString);
    txRequest.input('prep_time_minutes', sql.Int,               prepTime);
    txRequest.input('cook_time_minutes', sql.Int,               cookTime);
    txRequest.input('created_at',        sql.DateTime2,         new Date());

    await txRequest.query(`
      INSERT INTO NutriFit.recipes
        (recipe_id, author_id, image_url, title, description,
         serving_size, calories, instruction,
         prep_time_minutes, cook_time_minutes, created_at)
      VALUES
        (@recipe_id, @author_id, @image_url, @title, @description,
         @serving_size, @calories, @instruction,
         @prep_time_minutes, @cook_time_minutes, @created_at)
    `);

    // 7) For each ingredient: upsert into food_items, then link

    const ingList = recipe.ingredients?.ingredient || [];
    if (!Array.isArray(ingList) || ingList.length === 0) {
      throw new Error('Missing or invalid ingredients list');
    }

    for (const ing of ingList) {
      const {
        // FatSecret’s IDs aren’t UPCs, so we’ll use name lookup only:
        food_name: name,
        number_of_units: quantityRaw,
        measurement_description: unit,
        food_id: food_id,                    // optional external ref
        serving_id: serving_id
      } = ing;

      // Validate quantity/unit
      const quantity = parseFloat(quantityRaw);
      if (isNaN(quantity) || !unit) {
        throw new Error(`Invalid quantity or unit on ingredient "${name}"`);
      }

      // 7a) Try find existing food_item by name
      const findReq = new sql.Request(transaction);
      findReq.input('nm', sql.VarChar(255), name);
      const { recordset: found } = await findReq.query(
        `SELECT food_item_id FROM NutriFit.food_items WHERE name = @nm`
      );

      let foodItemId;
      if (found.length) {
        foodItemId = found[0].food_item_id;
      } else {
        // 7b) Insert new food_item (no UPC available)
        foodItemId = uuidv4();
        getIngredientDetails()
        const insReq = new sql.Request(transaction);
        insReq.input('fid',  sql.UniqueIdentifier, foodItemId);
        insReq.input('nm',   sql.VarChar(255),     name);
        insReq.input('cals', sql.Float,            null);    // unknown
        insReq.input('prot', sql.Float,            null);
        insReq.input('carb', sql.Float,            null);
        insReq.input('fat',  sql.Float,            null);
        await insReq.query(`
          INSERT INTO NutriFit.food_items
            (food_item_id, upc_barcode, name, calories, protein, carbohydrate, fat)
          VALUES
            (@fid, NULL, @nm, @cals, @prot, @carb, @fat)
        `);
  }

  // 7c) Link recipe ↔ ingredient
  const linkReq = new sql.Request(transaction);
  linkReq.input('rid',  sql.UniqueIdentifier, newRecipeId);
  linkReq.input('fid',  sql.UniqueIdentifier, foodItemId);
  linkReq.input('qty',  sql.Float,            quantity);
  linkReq.input('unit', sql.VarChar(50),      unit);
  await linkReq.query(`
    INSERT INTO NutriFit.recipe_ingredients
      (recipe_id, food_item_id, quantity, unit)
    VALUES
      (@rid, @fid, @qty, @unit)
  `);
}

    // 8) Commit & respond
    await transaction.commit();
    return res.json({ recipe_id: newRecipeId });

  } catch (err) {
    // Roll back on error
    if (transaction) await transaction.rollback();
    console.error(err);
    return res.status(500).json({ error: err.message || 'Server error' });
  } finally {
    if (pool) pool.close();
  }
}


export async function addRecipe(req, res) {
  try {
    // Parse incoming IDs
    const recipes = req.body.recipes.recipe;
    const maxResults = Number(req.body.recipes.max_results) || recipes.length;
    const bearerToken = process.env.FATSECRET_ACCESS_TOKEN;
    const apiBase = 'https://platform.fatsecret.com/rest';
    const idList = [];

    // Connect to database
    await sql.connect(config);

    for (let i = 0; i < maxResults && i < recipes.length; i++) {
      const recipeId = Number(recipes[i].recipe.recipe_id);

      // Fetch recipe details
      const detailUrl = `${apiBase}/recipe/v2?format=json&recipe_id=${recipeId}`;
      const detailResp = await fetch(detailUrl, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Accept': 'application/json'
        }
      });

      if (!detailResp.ok) {
        console.error(`Failed to fetch recipe ${recipeId}: ${detailResp.statusText}`);
        continue;
      }

      const body = await detailResp.json();
      const recipe = body.recipe;

      // Build instruction string
      const steps = recipe.directions.direction || [];
      const instructionString = steps
        .map(s => `${s.direction_number}. ${s.direction_description}`)
        .join(' ');

      // Insert into DB
      const reqDB = new sql.Request();
      const newId = uuidv4();
      idList.push(newId);

      reqDB.input('recipe_id', sql.UniqueIdentifier, newId);
      reqDB.input('author_id', sql.UniqueIdentifier, 'fatSecretId');
      reqDB.input('image_url', sql.VarChar(1000), recipe.recipe_images?.recipe_image?.[0] || null);
      reqDB.input('title', sql.VarChar(255), recipe.recipe_name);
      reqDB.input('description', sql.VarChar(255), recipe.recipe_description || null);
      reqDB.input('serving_size', sql.Int, Number(recipe.number_of_servings) || null);
      reqDB.input('calories', sql.Float, Number(recipe.serving_sizes?.serving?.calories || 0) * Number(recipe.number_of_servings || 1));
      reqDB.input('instruction', sql.VarChar(1000), instructionString);
      reqDB.input('prep_time_minutes', sql.Int, Number(recipe.preparation_time_min) || null);
      reqDB.input('cook_time_minutes', sql.Int, Number(recipe.cooking_time_min) || null);
      reqDB.input('created_at', sql.DateTime2, new Date());

      const insertQuery = `INSERT INTO NutriFit.recipes
        (recipe_id, author_id, image_url, title, description,
         calories, instruction, prep_time_minutes,
         cook_time_minutes, created_at)
       VALUES
        (@recipe_id, @author_id, @image_url, @title, @description,
         @calories, @instruction, @prep_time_minutes,
         @cook_time_minutes, @created_at)`;

      await reqDB.query(insertQuery);
    }

    res.json({ insertedIds: idList });
  } catch (error) {
    console.error('Error in addRecipe:', error);
    res.status(500).json({ error: error.message });
  }
}

