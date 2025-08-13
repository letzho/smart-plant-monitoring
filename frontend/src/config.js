// Configuration for API endpoints
const config = {
  // Development environment
  development: {
    apiBaseUrl: 'http://192.168.1.100:5000'  // Replace with your computer's actual IP address
  },
  // Production environment
  production: {
    apiBaseUrl: 'https://smart-plant-monitoring-2024-b3719e233b1b.herokuapp.com'
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate configuration
export const apiBaseUrl = config[environment].apiBaseUrl;
