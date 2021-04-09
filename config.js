require("dotenv").config();

module.exports = {
  app: {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || "9000",
  },
  auth: {
    register_secret: process.env.REGISTER_SECRET || "tritonse",
    jwt_secret: process.env.JWT_SECRET || "keyboard cat",
  },
  frontend: {
    uri: process.env.FRONTEND_URI || "http://localhost:3000/",
  },
  db: {
    uri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/",
  },
  uweast: {
    user: process.env.UWEAST_USER_EMAIL || "",
    pass: process.env.UWEAST_USER_PASSWORD || "",
  },
  paypal: {
    PAYPAL_ClIENT_EMAIL: process.env.PAYPAL_CLIENT_EMAIL || "",
  },
};
