import {createRequire} from "module";
const require = createRequire(import.meta.url);
// Import sql
const sql = require('mssql/msnodesqlv8');

import argon2 from "argon2"
import jsonwebtoken from "jsonwebtoken"
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

export async function register(req, res) {
    try {
        await sql.connect(config);        

        const emailRequest = new sql.Request();
        emailRequest.input('email', sql.VarChar(255), req.body.email);
        
        const emailResult = await emailRequest.query(`
            SELECT 1 
            FROM [NutriFit].[user]
            WHERE email = @email
        `);

        if(emailResult.recordset.length > 0) {
            throw new Error('Account already registered');
        }

        const hashedPassword = await argon2.hash(req.body.password);

        const request = new sql.Request();
        const newUserId = uuidv4();
        request.input('user_id', sql.UniqueIdentifier, newUserId);
        request.input('email', sql.VarChar(255), req.body.email);
        request.input('password', sql.VarChar(255), hashedPassword);
        request.input('display_name', sql.VarChar(255), req.body.display_name);
        request.input('date_joined', sql.Date, new Date());
        request.input('age', sql.Int, req.body.age);
        request.input('gender', sql.TinyInt, req.body.gender);
        request.input('weight', sql.Float, req.body.weight);
        request.input('height', sql.Float, req.body.height);
        const insertQuery = `
        INSERT INTO [NutriFit].[user]
            (user_id, email, password, display_name, date_joined, age, gender, weight, height)
        VALUES
            (@user_id, @email, @password, @display_name, @date_joined, @age, @gender, @weight, @height)
        `;
        const response = await request.query(insertQuery);
        return res.status(201).json('Account sucessfully registed');
    } catch(err) {
        // return res.status(500).json({error: err.message, stack: err.stack});
        return res.status(500).json("Unexpected error creating account");
    }
}

export async function getUser(req, res) {
    try {
        const query = "SELECT TOP 10 * FROM [NutriFit].[user]"; // Correct table name format
        await sql.connect(config);
        const result = await sql.query(query);
        return res.json(result.recordset);
    } catch(err) {
        console.error(err);
        return res.status(500).json({error: err.message});
    } finally {
        sql.close();
    }
}

export async function login(req, res) {
    try {
        await sql.connect(config);

        // No SQL Injection countermeasures

        const request = new sql.Request()
        const hashedPassword = await argon2.hash(req.body.password);
        request.input('email', sql.VarChar(255), req.body.email);
        request.input('password', sql.VarChar(255), hashedPassword);

        const query = 'SELECT * FROM [NutriFit].[user] WHERE email == @email AND password == @password'
        const response = await request.query(query);

        if(len(response.recordset) == 0) {
            throw new Error('Account does not exist');
        }
    }
}