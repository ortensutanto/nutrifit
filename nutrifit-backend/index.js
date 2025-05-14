// Routes (Masukin dari folder routes)
import users from "./routes/users.js"

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
