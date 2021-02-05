const mongoose = require("mongoose");
const mongodb = require("mongodb");
const { Item } = require("../models/item");

//Example of how to write queries/updates: https://github.com/TritonSE/tse-recruitment-backend/blob/master/services/applications.js

// returns all menuItems or false
async function getAllMenuItems() {
  try {
    return Item.find({}).exec();
  } catch (err) {
    return false;
  }
}

// @body: info conforming to the item schema
// adds a new item object to the Item DB
async function addNewItem(info) {
  try {
    return Item.create(info);
  } catch (err) {
    return false;
  }
}

// @body: id: the id of the object deleted
// deletes the item specified by id from the Item DB
async function deleteItem(id) {
  return await Item.deleteOne({ _id: new mongodb.ObjectID(id) }).exec();
}

// @body: id, info
// id: the id of the object to be edited
// info any subset of the aspects of the Item object
// edits any aspect of the item object and updates to DB
async function editItem(id, info) {
  try {
    // edit the item
    return await Item.updateOne(
      { _id: new mongodb.ObjectID(id) },
      { $set: info }
    ).exec();
  } catch (err) {
    console.log(err);
    return false;
  }
}

// @body: id, featured
// id: the id of the object to be edited
// featured: T/F value to set for the desired object's isFeatured
// Sets the isFeatured of an object to T or F
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
