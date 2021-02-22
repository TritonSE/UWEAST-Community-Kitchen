const mongoose = require("mongoose");

const menuImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
});

const MenuImage = mongoose.model("menuImage", menuImageSchema);
module.exports = { MenuImage };
