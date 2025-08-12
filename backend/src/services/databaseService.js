const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({ connectionString });

const testConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connected!');
    
    // Create tables if they don't exist
    await createTables();
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

const createTables = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        serial_number VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create sensor_data table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sensor_data (
        id SERIAL PRIMARY KEY,
        serial_number VARCHAR(255) NOT NULL,
        temperature DECIMAL(5,2),
        humidity DECIMAL(5,2),
        moisture DECIMAL(5,2),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database tables created successfully!');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};

module.exports = { pool, testConnection }; 