const mqtt = require('mqtt');
const { pool } = require('../services/databaseService');

const start = () => {
  const client = mqtt.connect('mqtt://broker.mqttgo.io:1883');
  client.on('connect', () => {
    client.subscribe('plant/+/data');
  });

  client.on('message', async (topic, message) => {
    const [_, serial, type] = topic.split('/');
    if (type === 'data') {
      try {
        const { temperature, humidity, moisture } = JSON.parse(message.toString());
        await pool.query(
          'INSERT INTO sensor_data (serial_number, temperature, humidity, moisture) VALUES ($1, $2, $3, $4)',
          [serial, temperature, humidity, moisture]
        );
      } catch (e) {
        console.error('Failed to parse or insert sensor data:', e);
      }
    }
  });
};

module.exports = { start }; 