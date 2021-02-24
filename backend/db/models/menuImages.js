/**
 * File sets up the menuImage mongoose schema.
 *
 * @summary   Creation of the menuImage DB
 */
const mongoose = require("mongoose");

const menuImageSchema = new mongoose.Schema({
  // image link for menu header 
  imageUrl: { type: String, required: true },
});

const MenuImage = mongoose.model("menuImage", menuImageSchema);
module.exports = { MenuImage };
