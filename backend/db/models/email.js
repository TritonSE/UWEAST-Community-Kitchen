const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  email: String,
});

const Email = mongoose.model("Email", emailSchema);
module.exports = { Email };
