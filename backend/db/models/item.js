const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  pictureURL: { type: String, required: true },
  Description: { type: String, required: true },
  Category: { type: String, required: true },
  Prices: {
    Individual: { type: String },
    Family: { type: String },
  },
  isFeatured: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  Accomodations: {
    type: [
      {
        Description: String,
        Price: String,
      },
    ],
    default: [],
  },
  // tags: { type: [String], required: true },
});
const Item = mongoose.model("Item", itemSchema);

module.exports = { Item };
