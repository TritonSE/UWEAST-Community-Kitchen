/**
 * File sets up the item mongoose schema.
 *
 * @summary   Creation of the Item DB.
 */
const mongoose = require("mongoose");

// Prices set to 2 decimal places
const itemSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  // assumes its a valid image url
  pictureURL: { type: String, required: true },
  Description: { type: String, required: true },
  Category: { type: String, required: true },
  // only one price is required, though both may be filled out too
  Prices: {
    Individual: {
      type: String,
      set: (v) => {
        if (v === "") return;
        return (+v).toFixed(2);
      },
    },
    Family: {
      type: String,
      set: (v) => {
        if (v === "") return;
        return (+v).toFixed(2);
      },
    },
  },
  specialInstructions: { type: String, default: "" },
  dietaryInfo: {
    vegan: { type: Boolean, default: false },
    vegetarian: { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
    containsDairy: { type: Boolean, default: false },
  },
  isFeatured: { type: Boolean, default: false },
  Accommodations: {
    type: [
      {
        Description: { type: String, required: true },
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
});
const Item = mongoose.model("Item", itemSchema);

module.exports = { Item };
