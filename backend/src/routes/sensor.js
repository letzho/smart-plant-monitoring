const express = require('express');
const { pool } = require('../services/databaseService');
const { realTimeData } = require('../mqtt/mqttService');
const router = express.Router();

router.get('/latest', async (req, res) => {
  try {
    const { serial_number } = req.query;
    console.log('Fetching latest data for serial_number:', serial_number);
    
    // First check if we have real-time data
    if (realTimeData.has(serial_number)) {
      const realTime = realTimeData.get(serial_number);
      console.log('Returning real-time data:', realTime);
      res.json(realTime);
      return;
    }
    
    // Fallback to database data
    const result = await pool.query(
      'SELECT * FROM sensor_data WHERE serial_number=$1 ORDER BY timestamp DESC LIMIT 1',
      [serial_number]
    );
    
    console.log('Database result rows:', result.rows.length);
    console.log('Database result:', result.rows);
    
    if (result.rows.length === 0) {
      // Create a default entry in database if no data exists
      try {
        const defaultData = {
          temperature: 0,
          humidity: 0,
          moisture: 0,
          timestamp: new Date().toISOString()
        };
        
        await pool.query(
          'INSERT INTO sensor_data (serial_number, temperature, humidity, moisture) VALUES ($1, $2, $3, $4)',
          [serial_number, defaultData.temperature, defaultData.humidity, defaultData.moisture]
        );
        
        console.log('Created default database entry for:', serial_number);
        res.json(defaultData);
      } catch (error) {
        console.error('Error creating default entry:', error);
        res.json({
          temperature: 0,
          humidity: 0,
          moisture: 0,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      console.log('Returning database data:', result.rows[0]);
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

// Remove test data endpoint - only real sensor data should be used

// Clean up test data endpoint (one-time use)
router.post('/cleanup-test-data', async (req, res) => {
  try {
    const { serial_number } = req.body;
    await pool.query(
      'DELETE FROM sensor_data WHERE serial_number = $1',
      [serial_number]
    );
    res.json({ message: 'Test data cleaned up successfully' });
  } catch (error) {
    console.error('Error cleaning up test data:', error);
    res.status(500).json({ error: 'Failed to clean up test data' });
  }
});

module.exports = router; 