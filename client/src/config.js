module.exports = {
  app: {
    env: process.env.NODE_ENV || "development",
  },
  backend: {
    uri: process.env.REACT_APP_BACKEND_URI || "http://localhost:9000/",
  },
  google: {
    MAPS_API_CODE: process.env.REACT_APP_MAPS_API_CODE || "",
  },
};
