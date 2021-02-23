/**
 * File sets up the menuImage mongoose schema.
 *
 * @summary   Creation of the menuImage DB
 */
const mongoose = require("mongoose");

const menuImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
});

const MenuImage = mongoose.model("menuImage", menuImageSchema);
module.exports = { MenuImage };
