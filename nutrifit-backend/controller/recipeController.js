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

// WIP, buat kasih liat resep
// export async function getRecipe(req, res) {
//     try {
//         await sql.connect(config);
//     
//         const request = new sql.Request();
//     }
// }
