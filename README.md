# Smart Plant Monitoring System

A full-stack web application for monitoring plant environmental conditions and providing AI-powered recommendations for optimal plant care.

## Features

- Real-time sensor data monitoring (Temperature, Humidity, Soil Moisture)
- AI-powered plant care recommendations
- User authentication and device management
- Historical data tracking
- Responsive web interface

## Tech Stack

- **Frontend**: React.js, Vite
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **AI**: OpenAI GPT-3.5-turbo
- **Charts**: React Gauge Chart

## Project Structure

```
SMART_PLANT_MONITORING/
├── frontend/          # React frontend application
├── backend/           # Node.js backend API
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL database
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your actual values:
   - Database credentials
   - OpenAI API key
   - JWT secret

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend (.env)
- `DB_HOST`: Database host
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `DB_PORT`: Database port
- `OPENAI_API_KEY`: OpenAI API key
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `JWT_SECRET`: JWT secret for authentication

## API Endpoints

- `POST /api/user/login` - User login
- `POST /api/user/register` - User registration
- `GET /api/sensor/latest` - Get latest sensor data
- `GET /api/sensor/history` - Get historical sensor data
- `POST /api/recommendation` - Get AI recommendations

## Deployment

### Heroku Deployment

1. Create a Heroku account and install Heroku CLI
2. Create a new Heroku app
3. Set up environment variables in Heroku dashboard
4. Deploy using Git:
   ```bash
   git push heroku main
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 