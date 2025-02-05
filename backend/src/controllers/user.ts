import { Request, Response } from 'express';
import { eq } from "drizzle-orm";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { drizzle as pg } from 'drizzle-orm/node-postgres';
import { userModel } from '../models/user';

const postgresUrl = process.env.POSTGRES_URL;

if (!postgresUrl) {
    throw new Error('POSTGRES_URL is not defined in environment variables.');
}

const pgDB = pg(postgresUrl);

export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const newUser = await pgDB.insert(userModel).values({
            username,
            password: hashedPassword,
        }).returning();

        res.status(201).json({ message: 'User registered successfully', user: newUser[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error registering user' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await pgDB.select().from(userModel).where(eq(userModel.username, username)).limit(1).execute();

        if (user.length === 0) {
            res.status(400).json({ error: 'User not found' });
			return
        }

        const existingUser = user[0];

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
			res.status(400).json({ error: 'Invalid credentials' });
			return
        }

        const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error logging in' });
    }
};
