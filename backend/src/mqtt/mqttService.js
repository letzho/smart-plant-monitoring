const mqtt = require('mqtt');
const { pool } = require('../services/databaseService');

// Store latest real-time data in memory (not database)
const realTimeData = new Map();

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
        const { temperature, humidity, moisture, update_database } = data;
        
        // Always store real-time data in memory
        const realTimeEntry = {
          temperature: parseFloat(temperature),
          humidity: parseFloat(humidity),
          moisture: parseFloat(moisture),
          timestamp: new Date().toISOString()
        };
        realTimeData.set(serial, realTimeEntry);
        
        // Only insert into database if update_database flag is true
        if (update_database) {
          await pool.query(
            'INSERT INTO sensor_data (serial_number, temperature, humidity, moisture) VALUES ($1, $2, $3, $4)',
            [serial, temperature, humidity, moisture]
          );
          console.log(`Database updated for device ${serial}: ${temperature}°C, ${humidity}%, ${moisture}%`);
        } else {
          console.log(`Real-time data received for device ${serial}: ${temperature}°C, ${humidity}%, ${moisture}%`);
        }
      } catch (e) {
        console.error('Failed to parse or insert sensor data:', e);
      }
    }
  });
};

module.exports = { start, realTimeData }; 