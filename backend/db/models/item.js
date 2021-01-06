const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  cuisine: String,
  tags: [String],
  vegan: Boolean,
  vegetarian: Boolean,
  glutenFree: Boolean,
  ingredients: [String],
  completed: Boolean,
  featured: Boolean,
});
const Item = mongoose.model('Item', itemSchema);

module.exports = { Item };