require('dotenv').config();

module.exports = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '9000'
  },
  auth: {
    register_secret: process.env.REGISTER_SECRET || 'tritonse',
    jwt_secret: process.env.JWT_SECRET || 'keyboard cat'
  },
  db: {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/UWEAST-CK'
  },
  uweast: {
    user: process.env.UWEAST_USER_EMAIL || "",
    pass: process.env.UWEAST_USER_PASSWORD || ""
  },
};