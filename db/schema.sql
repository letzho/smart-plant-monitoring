CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    serial_number VARCHAR(5) UNIQUE,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE sensor_data (
    id SERIAL PRIMARY KEY,
    serial_number VARCHAR(5) NOT NULL,
    temperature FLOAT,
    humidity FLOAT,
    moisture INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    serial_number VARCHAR(5) NOT NULL,
    suggestion TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 