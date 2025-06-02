import { createRequire } from "module";
const require = createRequire(import.meta.url);
// Import mysql
const mysql = require('mysql2');

import argon2 from "argon2"
import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv/config"
import { json } from "express"
import { v4 as uuidv4 } from "uuid"

const connectionString = "mysql://root:password@localhost:3306/NutriFit";

export async function register(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        // Log registration attempt
        console.log('Registration attempt:', {
            email: req.body.email,
            display_name: req.body.display_name,
            timestamp: new Date().toISOString()
        });
        // Check if email already exists
        const [emailResult] = await connection.promise().query(
            'SELECT 1 FROM NutriFit.user WHERE email = ?',
            [req.body.email]
        );

        if (emailResult.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Validate required fields
        if (!req.body.email || !req.body.password || !req.body.display_name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate data types and ranges
        if (
            typeof req.body.age !== 'number' || req.body.age <= 0 ||
            typeof req.body.gender !== 'number' || ![0, 1].includes(req.body.gender) ||
            typeof req.body.weight !== 'number' || req.body.weight <= 0 ||
            typeof req.body.height !== 'number' || req.body.height <= 0 ||
            typeof req.body.activity_level !== 'number' || ![1, 2, 3, 4, 5].includes(req.body.activity_level)
        ) {
            return res.status(400).json({ error: 'Invalid user data' });
        }

        const hashedPassword = await argon2.hash(req.body.password);
        const newUserId = uuidv4();

        // Insert query
        await connection.promise().query(
            `INSERT INTO NutriFit.user (
                user_id, 
                email, 
                password, 
                display_name, 
                date_joined, 
                age, 
                gender, 
                weight, 
                height, 
                activity_level
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                newUserId,
                req.body.email,
                hashedPassword,
                req.body.display_name,
                new Date(),
                req.body.age,
                req.body.gender,
                req.body.weight,
                req.body.height,
                req.body.activity_level
            ]
        );

        return res.status(201).json({
            message: 'Account successfully registered',
            userId: newUserId
        });
    } catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ error: 'Unexpected error creating account' });
    }
}

export async function getUser(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const [users] = await connection.promise().query('SELECT * FROM NutriFit.user LIMIT 10');
        return res.json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}

export async function login(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const [users] = await connection.promise().query(
            'SELECT user_id, password, display_name FROM NutriFit.user WHERE email = ?',
            [req.body.email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const passwordMatch = await argon2.verify(user.password, req.body.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const payload = { sub: user.user_id, name: user.display_name };
        const token = jsonwebtoken.sign(
            payload,
            process.env.JWT_SECRET,
        );
        return res.json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Unexpected error when logging in" });
    }
}

// Cek header punya bearer token ato ngga
export async function authentication(req) {
    const authHeader = req.headers.authorization;
    // Uses Bearer Schema (Bearer )
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unathorized: Token not provided');
    }
    const jwtoken = authHeader.split(' ')[1]; // (Bearer token) we grab the token
    if (!jwtoken) {
        throw new Error('Unathorized: Token not found');
    }
    try {
        const decodedToken = jsonwebtoken.verify(jwtoken, process.env.JWT_SECRET);
        return decodedToken;
    } catch (err) {
        throw new Error('Unauthorized: Token invalid');
    }
}

export async function editWeight(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const decodedToken = await authentication(req);
        const userId = decodedToken.sub;

        await connection.promise().query(
            'UPDATE NutriFit.user SET weight = ? WHERE user_id = ?',
            [req.body.weight, userId]
        );

        return res.status(200).json({ message: 'Weight updated successfully' });
    } catch (err) {
        console.error(err);
        if (err.message.startsWith('Unauthorized')) {
            return res.status(401).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}

export async function editAge(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const decodedToken = await authentication(req);
        const userId = decodedToken.sub;

        await connection.promise().query(
            'UPDATE NutriFit.user SET age = ? WHERE user_id = ?',
            [req.body.age, userId]
        );

        return res.status(200).json({ message: 'Age updated successfully' });
    } catch (err) {
        console.error(err);
        if (err.message.startsWith('Unauthorized')) {
            return res.status(401).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}

export async function editGender(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const decodedToken = await authentication(req);
        const userId = decodedToken.sub;

        await connection.promise().query(
            'UPDATE NutriFit.user SET gender = ? WHERE user_id = ?',
            [req.body.gender, userId]
        );

        return res.status(200).json({ message: 'Gender updated successfully' });
    } catch (err) {
        console.error(err);
        if (err.message.startsWith('Unauthorized')) {
            return res.status(401).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}

export async function editHeight(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const decodedToken = await authentication(req);
        const userId = decodedToken.sub;

        await connection.promise().query(
            'UPDATE NutriFit.user SET height = ? WHERE user_id = ?',
            [req.body.height, userId]
        );

        return res.status(200).json({ message: 'Height updated successfully' });
    } catch (err) {
        console.error(err);
        if (err.message.startsWith('Unauthorized')) {
            return res.status(401).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}

export async function editDisplayName(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const decodedToken = await authentication(req);
        const userId = decodedToken.sub;

        await connection.promise().query(
            'UPDATE NutriFit.user SET display_name = ? WHERE user_id = ?',
            [req.body.display_name, userId]
        );

        return res.status(200).json({ message: 'Display Name updated successfully' });
    } catch (err) {
        console.error(err);
        if (err.message.startsWith('Unauthorized')) {
            return res.status(401).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}

export async function getUserData(req, res) {
    try {
        const connection = await mysql.createConnection(connectionString);
        const decodedToken = await authentication(req);
        const userId = decodedToken.sub;

        const [users] = await connection.promise().query(
            'SELECT * FROM NutriFit.user WHERE user_id = ?',
            [userId]
        );

        if (!users || users.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        return res.status(200).json({ data: users });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}

