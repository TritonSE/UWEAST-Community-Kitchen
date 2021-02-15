require('dotenv').config();

module.exports = {
  app: {
    env: process.env.NODE_ENV || 'development',
  },
  backend: {
    uri: process.env.BACKEND_URI || 'http://localhost:9000/'
  },
};