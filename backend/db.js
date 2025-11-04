import mysql from 'mysql2/promise';

export let db;

// Conexion con base de datos
export async function conectarDB() {
    db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });
}