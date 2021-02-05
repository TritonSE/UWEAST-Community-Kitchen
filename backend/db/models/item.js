const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  pictureURL: { type: String, required: true },
  Description: { type: String, required: true },
  Category: { type: String, required: true },
  Prices: {
    Individual: {
      type: String,
      set: (v) => {
        if (v === "") return "";
        return (+v).toFixed(2);
      },
    },
    Family: {
      type: String,
      set: (v) => {
        if (v === "") return "";
        return (+v).toFixed(2);
      },
    },
  },
  specialInstructions: { type: String, default: "" },
  dietaryInfo: {
    vegan: { type: Boolean, default: false },
    vegetarian: { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
  },
  isFeatured: { type: Boolean, default: false },
  Accomodations: {
    type: [
      {
        Description: String,
        Price: {
          type: String,
          set: (v) => {
            if (v === "") return "";
            return (+v).toFixed(2);
          },
        },
      },
    ],
    default: [],
  },
  // tags: { type: [String], required: true },
});
const Item = mongoose.model("Item", itemSchema);

module.exports = { Item };
