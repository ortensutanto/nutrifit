// Routes (Masukin dari folder routes)
import users from "./routes/users.js"
import recipes from "./routes/recipes.js"
import addRecipes from "./routes/addrecipes.js"
import reviews from "./routes/reviews.js"
import favorites from "./routes/favorites.js"
import goals from "./routes/goals.js"
import nutrition from "./routes/nutrition.js"
import barcode from "./routes/barcode.js"
import foodSearch from "./routes/foodSearch.js"

import express from "express"
import cors from "cors"

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());

// Kalo mau panggil database pake yang dibawah ini
import {createRequire} from "module";
const require = createRequire(import.meta.url);
const sql = require('mssql/msnodesqlv8');


// Contoh Query
app.use("/users", users);
app.use("/recipes", recipes);
app.use("/reviews", reviews);
app.use("/addRecipe", addRecipes);
app.use("/favorites", favorites);
app.use("/goals", goals);
app.use("/nutrition", nutrition);
app.use("/barcode", barcode);
app.use("/foodSearch", foodSearch);

// Status endpoint
app.get("/status", (request, response) => {
    const status = {
        "Status": "Running"
    };
    response.json(status);
});


// Start server
app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});
