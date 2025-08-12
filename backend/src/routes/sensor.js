const express = require('express');
const { pool } = require('../services/databaseService');
const router = express.Router();

router.get('/latest', async (req, res) => {
  try {
    const { serial_number } = req.query;
    const result = await pool.query(
      'SELECT * FROM sensor_data WHERE serial_number=$1 ORDER BY timestamp DESC LIMIT 1',
      [serial_number]
    );
    
    if (result.rows.length === 0) {
      // Return default values when no data exists
      res.json({
        temperature: 0,
        humidity: 0,
        moisture: 0,
        timestamp: new Date().toISOString()
      });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching latest sensor data:', error);
    res.status(500).json({ error: 'Failed to fetch sensor data' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const { serial_number } = req.query;
    const result = await pool.query(
      'SELECT * FROM sensor_data WHERE serial_number=$1 ORDER BY timestamp DESC LIMIT 100',
      [serial_number]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sensor history:', error);
    res.status(500).json({ error: 'Failed to fetch sensor history' });
  }
});

// Add recommendation endpoint if needed, using pool

module.exports = router; 