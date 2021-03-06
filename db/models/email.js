/**
 * File sets up the email mongoose schema.
 *
 * @summary   Creation of the Email DB.
 */
const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  // true if primary email, false if secondary email
  isPrimary: { type: Boolean, default: false, required: true },
});

const Email = mongoose.model("Email", emailSchema);
module.exports = { Email };
