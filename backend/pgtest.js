import dotenv from 'dotenv';
dotenv.config();
import { Pool } from 'pg';

const {
  DATABASE_URL,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME
} = process.env;

const connectionString =
  DATABASE_URL ||
  `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

console.log('Testing connection with:', connectionString);

const pool = new Pool({ connectionString });

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PG TEST ERROR:', err);
  } else {
    console.log('PG TEST SUCCESS:', res.rows);
  }
  pool.end();
});