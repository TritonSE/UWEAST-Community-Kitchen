const mongoose = require("mongoose");
const mongodb = require("mongodb");
const { Item } = require("../models/item");

//Example of how to write queries/updates: https://github.com/TritonSE/tse-recruitment-backend/blob/master/services/applications.js

async function getAllMenuItems() {
  try {
    return Item.find({}).exec();
  } catch (err) {
    return false;
  }
}

// function itemFromInfo(info) {
//   return {
//     name: info.name,
//     description: info.description,
//     price: info.price,
//     category: info.category,
//     image: info.image,
//     cuisine: info.cuisine,
//     tags: info.tags,
//     vegan: info.vegan,
//     vegetarian: info.vegetarian,
//     glutenFree: info.glutenFree,
//     ingredients: info.ingredients,
//   };
// }

async function addNewItem(info) {
  try {
    return Item.create(info);
  } catch (err) {
    return false;
  }
}

async function deleteItem(id) {
  return await Item.deleteOne({ _id: new mongodb.ObjectID(id) }).exec();
}

async function editItem(id, info) {
  try {
    return await Item.updateOne(
      { _id: new mongodb.ObjectID(id) },
      { $set: info }
    ).exec();
  } catch (err) {
    return false;
  }
}

async function setFeatured(id, featured) {
  try {
    return await Item.updateOne(
      { _id: new mongodb.ObjectID(id) },
      { $set: { isFeatured: featured } }
    ).exec();
  } catch (err) {
    return false;
  }
}

// function setNotFeatured(id) {
//   Item.updateOne(
//     { _id: new mongodb.ObjectID(id) },
//     { $set: { featured: false } },
//     (err, results) => {}
//   );
// }

module.exports = {
  getAllMenuItems,
  addNewItem,
  deleteItem,
  editItem,
  setFeatured,
  // setNotFeatured,
};
