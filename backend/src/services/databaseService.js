const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({ connectionString });

const testConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connected!');
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

module.exports = { pool, testConnection }; 