const express = require('express');
const { pool } = require('../services/databaseService');
const router = express.Router();

router.get('/all', async (req, res) => {
  const result = await pool.query(
    'SELECT u.username, u.serial_number, s.temperature, s.humidity, s.moisture, s.timestamp FROM users u LEFT JOIN LATERAL (SELECT * FROM sensor_data s WHERE s.serial_number = u.serial_number ORDER BY timestamp DESC LIMIT 1) s ON true'
  );
  res.json(result.rows);
});

module.exports = router; 