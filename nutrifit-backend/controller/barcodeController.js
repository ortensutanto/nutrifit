import {createRequire} from "module";
const require = createRequire(import.meta.url);
// Import sql
const sql = require('mssql/msnodesqlv8');

import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv/config"
import { json } from "express"
import { v4 as uuidv4 }from "uuid"

const config = {
    server: ".",
    database: "NutriFit",
    options: {
        trustedConnection: true,
        trustServerCertificate: true,
    },
    driver: "msnodesqlv8"
};

export async function getBarcode(req, res) {
    try {

    }  
}

