/**
 * Central file and intial source point of backend. Establishes database connection, and redirects Express routes
 * to appropriate sub-compartments for implementation. 
 * 
 * @summary   Initialization of backend. 
 * @author    Amrit Kaur Singh, Thomas Garry
 */
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");
const mongoose = require("mongoose");
const config = require("./config");

//MongoDB Connection via Mongoose
mongoose.set("useUnifiedTopology", true);
mongoose.set("useNewUrlParser", true);
mongoose.connect(config.db.uri);
mongoose.connection.once("open", async () => {
  console.log("Established connection to MongoDB.");
  // console.log(config.db.uri);
  console.log("Server starting at Port: " + config.app.port);
});

const app = express();

//Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ methods: ["GET", "POST", "PUT", "DELETE"] }));

//Routers
app.use("/user", require("./routes/user"));
app.use("/autoEmails", require("./routes/autoEmails"));
app.use("/email", require("./routes/email"));
app.use("/item", require("./routes/item"));
app.use("/jwt", require("./routes/jwt"));
app.use("/order", require("./routes/order"));
app.use("/menuImages", require("./routes/menuImages"));
app.use("/paypal", require("./routes/paypal"));

// production 
if(config.app.env === 'production'){
  // link React frontend
  app.use(express.static(path.join(__dirname, "client", "build")));

  // any routes called that are not handled by server are forwarded to frontend
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
  
// development
} else {
  app.get("/", function (req, res) {
    res.status(200).json({ message: "Abandon All Hope Ye Who Enter Here..." });
  });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.error("Error caught");
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ message: err.message });
});

module.exports = app;
