const express = require('express');
const { pool } = require('../services/databaseService');
const router = express.Router();

router.get('/latest', async (req, res) => {
  try {
    const { serial_number } = req.query;
    console.log('Fetching latest data for serial_number:', serial_number);
    
    const result = await pool.query(
      'SELECT * FROM sensor_data WHERE serial_number=$1 ORDER BY timestamp DESC LIMIT 1',
      [serial_number]
    );
    
    console.log('Database result rows:', result.rows.length);
    console.log('Database result:', result.rows);
    
    if (result.rows.length === 0) {
      // Return default values when no data exists
      const defaultData = {
        temperature: 0,
        humidity: 0,
        moisture: 0,
        timestamp: new Date().toISOString()
      };
      console.log('Returning default data:', defaultData);
      res.json(defaultData);
    } else {
      console.log('Returning actual data:', result.rows[0]);
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

// Add test data endpoint for debugging
router.post('/test-data', async (req, res) => {
  try {
    const { serial_number, temperature, humidity, moisture } = req.body;
    const testData = {
      temperature: temperature !== undefined ? temperature : 27.8,
      humidity: humidity !== undefined ? humidity : 69.7,
      moisture: moisture !== undefined ? moisture : 45.2,
      timestamp: new Date()
    };
    
    await pool.query(
      'INSERT INTO sensor_data (serial_number, temperature, humidity, moisture, timestamp) VALUES ($1, $2, $3, $4, $5)',
      [serial_number, testData.temperature, testData.humidity, testData.moisture, testData.timestamp]
    );
    
    res.json({ message: 'Test data inserted successfully', data: testData });
  } catch (error) {
    console.error('Error inserting test data:', error);
    res.status(500).json({ error: 'Failed to insert test data' });
  }
});

module.exports = router; 