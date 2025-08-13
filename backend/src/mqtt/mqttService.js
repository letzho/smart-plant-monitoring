const mqtt = require('mqtt');
const { pool } = require('../services/databaseService');

// Store latest real-time data in memory (not database)
const realTimeData = new Map();

// Track last database update time for each device (10-minute intervals)
const lastDatabaseUpdate = new Map();
const DATABASE_UPDATE_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

const start = () => {
  const client = mqtt.connect('mqtt://broker.mqttgo.io:1883');
  client.on('connect', () => {
    client.subscribe('plant/+/data');
  });

  client.on('message', async (topic, message) => {
    const [_, serial, type] = topic.split('/');
    if (type === 'data') {
      try {
        const data = JSON.parse(message.toString());
        const { temperature, humidity, moisture } = data;
        
        // Always store real-time data in memory
        const realTimeEntry = {
          temperature: parseFloat(temperature),
          humidity: parseFloat(humidity),
          moisture: parseFloat(moisture),
          timestamp: new Date().toISOString()
        };
        realTimeData.set(serial, realTimeEntry);
        
        // Check if we should update database (first data or every 10 minutes)
        const currentTime = Date.now();
        const lastUpdate = lastDatabaseUpdate.get(serial) || 0;
        const timeSinceLastUpdate = currentTime - lastUpdate;
        
        // Update database if:
        // 1. This is the first data from this device (lastUpdate === 0)
        // 2. It's been more than 10 minutes since last update
        const shouldUpdateDatabase = lastUpdate === 0 || timeSinceLastUpdate >= DATABASE_UPDATE_INTERVAL;
        
        if (shouldUpdateDatabase) {
          await pool.query(
            'INSERT INTO sensor_data (serial_number, temperature, humidity, moisture) VALUES ($1, $2, $3, $4)',
            [serial, temperature, humidity, moisture]
          );
          lastDatabaseUpdate.set(serial, currentTime);
          
          if (lastUpdate === 0) {
            console.log(`First data captured for device ${serial}: ${temperature}°C, ${humidity}%, ${moisture}%`);
          } else {
            console.log(`Database updated for device ${serial} (after ${Math.round(timeSinceLastUpdate/1000/60)}min): ${temperature}°C, ${humidity}%, ${moisture}%`);
          }
        } else {
          console.log(`Real-time data received for device ${serial} (${Math.round((DATABASE_UPDATE_INTERVAL - timeSinceLastUpdate)/1000/60)}min until next DB update): ${temperature}°C, ${humidity}%, ${moisture}%`);
        }
      } catch (e) {
        console.error('Failed to parse or insert sensor data:', e);
      }
    }
  });
};

module.exports = { start, realTimeData }; 