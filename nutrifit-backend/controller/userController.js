import {createRequire} from "module";
const require = createRequire(import.meta.url);
// Import sql
const sql = require('mssql/msnodesqlv8');

import argon2 from "argon2"
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
    } finally {
        sql.close();
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
        const request = new sql.Request()
        request.input('email', sql.VarChar(255), req.body.email);

        const query = 'SELECT user_id, password, display_name FROM [NutriFit].[user] WHERE email = @email'
        const { recordset } = await request.query(query);

        if(recordset.length == 0) {
            return res.status(401).json({ error: 'Invalid credentials'});
        }

        const user = recordset[0];
        const passwordMatch = await argon2.verify(user.password, req.body.password);
        if(!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials'});
        }

        const payload = { sub: user.user_id, name: user.display_name };
        const token = jsonwebtoken.sign(
            payload,
            process.env.JWT_SECRET,
        );
        return res.json({ token });
    } catch(err) {
        // console.error(err);
        return res.status(500).json({ error: "Unexpected error when logging in"});
    } finally {
        sql.close();
    }
}

async function authentication(req) {
    const authHeader = req.headers.authorization;
    // Uses Bearer Schema (Bearer )
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unathorized: Token not provided');
    }
    const jwtoken = authHeader.split(' ')[1]; // (Bearer token) we grab the token
    if(!jwtoken) {
        throw new Error('Unathorized: Token not found');
    }
    try {
        const decodedToken = jsonwebtoken.verify(jwtoken, process.env.JWT_SECRET);
        return decodedToken;
    } catch(err) {
        throw new Error('Unauthorized: Token invalid');
    }
}

export async function editWeight(req, res) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('weight', sql.Float, req.body.weight);

        const decodedToken = await authentication(req);
        const userId = decodedToken.sub; // For some reason it's called sub
        request.input('user_id', sql.UniqueIdentifier, userId);
        const query = 'UPDATE [NutriFit].[user] SET weight = @weight WHERE user_id=@user_id';
        await request.query(query);

        return res.status(200).json({ message: 'Weight updated successfuly' })
    } catch(err) {
        console.error(err);
        if(err.message.startsWith('Unauthorized')) {
            return res.status(401).json({ error: err.message });
        }
        return res.status(500).json({error: 'Unexpected error occured'});
    } finally {
        sql.close();
    }
}

export async function editAge(req, res) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('age', sql.Int, req.body.age);

        const decodedToken = await authentication(req);
        const userId = decodedToken.sub; // For some reason it's called sub
        request.input('user_id', sql.UniqueIdentifier, userId);
        const query = 'UPDATE [NutriFit].[user] SET age = @age WHERE user_id=@user_id';
        await request.query(query);

        return res.status(200).json({ message: 'Age updated successfuly' })
    } catch(err) {
        console.error(err);
        if(err.message.startsWith('Unauthorized')) {
            return res.status(401).json({ error: err.message });
        }
        return res.status(500).json({error: 'Unexpected error occured'});
    } finally {
        sql.close();
    }
}

export async function editGender(req, res) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('gender', sql.TinyInt, req.body.gender);

        const decodedToken = await authentication(req);
        const userId = decodedToken.sub; // For some reason it's called sub
        request.input('user_id', sql.UniqueIdentifier, userId);
        const query = 'UPDATE [NutriFit].[user] SET gender = @gender WHERE user_id=@user_id';
        await request.query(query);

        return res.status(200).json({ message: 'Gender updated successfuly' })
    } catch(err) {
        console.error(err);
        if(err.message.startsWith('Unauthorized')) {
            return res.status(401).json({ error: err.message });
        }
        return res.status(500).json({error: 'Unexpected error occured'});
    } finally {
        sql.close();
    }
}

export async function editHeight(req, res) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('height', sql.Float, req.body.height);

        const decodedToken = await authentication(req);
        const userId = decodedToken.sub; // For some reason it's called sub
        request.input('user_id', sql.UniqueIdentifier, userId);
        const query = 'UPDATE [NutriFit].[user] SET height = @height WHERE user_id=@user_id';
        await request.query(query);

        return res.status(200).json({ message: 'Height updated successfuly' })
    } catch(err) {
        console.error(err);
        if(err.message.startsWith('Unauthorized')) {
            return res.status(401).json({ error: err.message });
        }
        return res.status(500).json({error: 'Unexpected error occured'});
    } finally {
        sql.close();
    }
}

export async function editDisplayName(req, res) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('display_name', sql.Float, req.body.display_name);

        const decodedToken = await authentication(req);
        const userId = decodedToken.sub; // For some reason it's called sub
        request.input('user_id', sql.UniqueIdentifier, userId);
        const query = 'UPDATE [NutriFit].[user] SET display_name = @display_name WHERE user_id=@user_id';
        await request.query(query);

        return res.status(200).json({ message: 'Display Name updated successfuly' })
    } catch(err) {
        console.error(err);
        if(err.message.startsWith('Unauthorized')) {
            return res.status(401).json({ error: err.message });
        }
        return res.status(500).json({error: 'Unexpected error occured'});
    } finally {
        sql.close();
    }
}

export async function getUserData(req, res) {
     try {
        await sql.connect(config);
        const request = new sql.Request();
        decodedToken = await authentication(req);
        const userId = decoded.sub;
        request.input('user_id', sql.UniqueIdentifier, userId);
        const query = 'SELECT * FROM [NutriFit].[user] WHERE user_id = @user_id';
        await request.query(query);

        return res.status(200).json({ data:request.recordset });
     } catch(err) {
        console.error(err);
        return res.status(500).json({error: 'Unexpected error occured'});
     } finally {
        sql.close();
     }
}
