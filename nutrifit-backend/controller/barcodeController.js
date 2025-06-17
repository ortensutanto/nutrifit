import { createRequire } from "module";
const require = createRequire(import.meta.url);
// Import mysql
const mysql = require("mysql2");
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv/config";
import { v4 as uuidv4 } from "uuid";

// const connectionString = "mysql://root:password@localhost:3306/NutriFit";
const connectionString = "mysql://root:@localhost:3306/NutriFit";

async function addToFoodItemDatabase(
  food_item_id,
  upc_barcode,
  name,
  calories,
  protein,
  carbohydrate,
  fat
) {
  const connection = await mysql.createConnection(connectionString);
  try {
    await connection.promise().query(
      `
            INSERT INTO NutriFit.food_items
            (food_item_id, upc_barcode, name, calories, protein, carbohydrate, fat)
            VALUES
            (?, ?, ?, ?, ?, ?, ?)
            `,
      [food_item_id, upc_barcode, name, calories, protein, carbohydrate, fat]
    );

    return { success: true, message: "Food Item Successfully Created" };
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await connection.end();
  }
}

export async function scanBarcodeAPI(req, res) {
  const connection = await mysql.createConnection(connectionString);
  try {
    const barcodeScan = req.body.upc_barcode;
    if (!barcodeScan) {
      return res.status(400).json({ error: "Barcode not provided" });
    }

    const [foodRows] = await connection.promise().query(
      `
            SELECT * FROM food_items WHERE upc_barcode = ?
            `,
      [req.body.upc_barcode]
    );

    if (foodRows && foodRows.length > 0) {
      console.log("Found item in local database");
      return res.status(200).json(foodRows[0]);
    }

    // Staging API
    const API_URL = `https://world.openfoodfacts.net/api/v2/product/${String(
      barcodeScan
    )}?fields=product_name,nutriments`;
    const response = await fetch(API_URL, {
      headers: {
        Authorization: "Basic " + btoa("off:off"),
        "User-Agent": "NutriFit/1.0 (ortensutanto@gmail.com)",
      },
    });

    if (!response.ok) {
      // Handle non-successful API responses
      const errorText = await response.text();
      console.error(
        `Open Food Facts API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return res
        .status(response.status)
        .json({
          error: `Failed to fetch data from Open Food Facts: ${response.statusText}`,
          details: errorText,
        });
    }

    const data = await response.json();

    if (data.status === 0 || data.status == 0) {
      console.log("Not found on Open Food Facts API");
      return res
        .status(404)
        .json({ error: "Product not found on Open Food Facts API" });
    }

    const food_item_id = uuidv4();
    const name = data.product.product_name;
    const calories =
      data.product.nutriments["energy-kcal_serving"] ||
      data.product.nutriments["energy-kcal"] ||
      0;
    const protein =
      data.product.nutriments.proteins_serving ||
      data.product.nutriments.proteins ||
      0;
    const carbohydrate =
      data.product.nutriments.carbohydrates_serving ||
      data.product.nutriments.carbohydrates ||
      0;
    const fat =
      data.product.nutriments.fat_serving || data.product.nutriments.fat || 0;
    await addToFoodItemDatabase(
      food_item_id,
      barcodeScan,
      name,
      calories,
      protein,
      carbohydrate,
      fat
    );

    const newFoodItem = {
      food_item_id,
      barcodeScan,
      name,
      calories,
      protein,
      carbohydrate,
      fat,
    };

    return res.status(200).json(newFoodItem);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
}

export async function scanBarcode(req, res) {
  try {
    const connection = await mysql.createConnection(connectionString);
    const [foodItem] = await connection
      .promise()
      .query("SELECT * FROM NutriFit.food_items WHERE barcode = ?", [
        req.body.barcode,
      ]);

    if (!foodItem || foodItem.length === 0) {
      return res.status(404).json({ error: "Food item not found" });
    }

    return res.status(200).json({ data: foodItem[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}

export async function addBarcodeItem(req, res) {
  try {
    const connection = await mysql.createConnection(connectionString);
    await connection.promise().query(
      `INSERT INTO NutriFit.food_items 
                (food_item_id, name, barcode, calories, protein, carbohydrate, fat)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        req.body.name,
        req.body.barcode,
        req.body.calories,
        req.body.protein,
        req.body.carbohydrate,
        req.body.fat,
      ]
    );

    return res.status(201).json({ message: "Food item added successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}
