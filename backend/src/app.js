const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/user');
const sensorRoutes = require('./routes/sensor');
const adminRoutes = require('./routes/admin');
const recommendationRoutes = require('./routes/recommendation');
const mqttService = require('./mqtt/mqttService');
const { testConnection } = require('./services/databaseService');

testConnection();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API routes
app.use('/api/user', userRoutes);
app.use('/api/sensor', sensorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recommendation', recommendationRoutes);

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

mqttService.start();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 