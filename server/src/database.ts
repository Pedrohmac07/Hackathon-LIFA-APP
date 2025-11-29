import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const caPath = path.resolve(process.cwd(), 'ca.pem');

export const pool = mysql.createPool({
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 database: process.env.DB_NAME,
 port: Number(process.env.DB_PORT),
 ssl: {
  ca: fs.readFileSync(caPath),
  rejectUnauthorized: true
 },
 waitForConnections: true,
 connectionLimit: 10,
 queueLimit: 0
});
