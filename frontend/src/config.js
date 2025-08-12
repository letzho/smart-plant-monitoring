// Configuration for API endpoints
const config = {
  // Development environment
  development: {
    apiBaseUrl: 'http://localhost:3001'
  },
  // Production environment
  production: {
    apiBaseUrl: ''
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate configuration
export const apiBaseUrl = config[environment].apiBaseUrl;
