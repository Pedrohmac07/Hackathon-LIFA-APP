import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const caPath = path.resolve(process.cwd(), 'ca.pem');

if (!fs.existsSync(caPath)) {
 console.error(`❌ CRÍTICO: Arquivo ca.pem não encontrado em: ${caPath}`);
 console.error('Verifique se o arquivo está na raiz da pasta server e foi comitado no Git.');
}

export const pool = mysql.createPool({
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 database: process.env.DB_NAME,
 port: Number(process.env.DB_PORT),
 ssl: {
  ca: fs.readFileSync(caPath),
  rejectUnauthorized: false
 },
 waitForConnections: true,
 connectionLimit: 10,
 queueLimit: 0
});

pool.getConnection()
 .then((conn) => {
  console.log('SUCESSO: Conectado ao banco de dados Aiven!');
  conn.release();
 })
 .catch((err) => {
  console.error('ERRO FATAL DE CONEXÃO COM O BANCO:', err.message);
 });
