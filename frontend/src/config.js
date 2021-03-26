
module.exports = {
  app: {
    env: process.env.NODE_ENV || 'development',
  },
  backend: {
    uri: process.env.BACKEND_URI || 'http://localhost:9000/'
  },
  google: {
    MAPS_API_CODE: process.env.REACT_APP_MAPS_API_CODE || "AIzaSyAYe12_fPCYzLJawQNeabZORGYE5a5GnEU"
  }
};