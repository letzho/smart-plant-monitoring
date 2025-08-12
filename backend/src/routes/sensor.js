const express = require('express');
const { pool } = require('../services/databaseService');
const router = express.Router();

router.get('/latest', async (req, res) => {
  const { serial_number } = req.query;
  const result = await pool.query(
    'SELECT * FROM sensor_data WHERE serial_number=$1 ORDER BY timestamp DESC LIMIT 1',
    [serial_number]
  );
  res.json(result.rows[0]);
});

router.get('/history', async (req, res) => {
  const { serial_number } = req.query;
  const result = await pool.query(
    'SELECT * FROM sensor_data WHERE serial_number=$1 ORDER BY timestamp DESC LIMIT 100',
    [serial_number]
  );
  res.json(result.rows);
});

// Add recommendation endpoint if needed, using pool

module.exports = router; 