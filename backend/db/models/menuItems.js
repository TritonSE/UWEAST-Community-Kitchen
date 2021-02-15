const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
module.exports = { MenuItem };
