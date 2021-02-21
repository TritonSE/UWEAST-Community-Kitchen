/**
 * This file allows for interaction with the Item DB.
 * Contains methods that find all menu items, add new items,
 * delete an item, edit an item, and set an item to be featured.
 */
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const { Item } = require("../models/item");

// @description - returns all menuItems, false upon err
// @return - array of menuitems / false
async function getAllMenuItems() {
  try {
    return Item.find({}).exec();
  } catch (err) {
    return false;
  }
}

// @description - adds a new item object to the Item DB
// @param {object} info - conforming to the item schema
// @return - true on deletion / false
async function addNewItem(info) {
  try {
    return Item.create(info);
  } catch (err) {
    return false;
  }
}

// @description - deletes the item specified by id from the Item DB
// @param {mongoid} id - the id of the object deleted
// @return - true on deletion / false
async function deleteItem(id) {
  return await Item.deleteOne({ _id: new mongodb.ObjectID(id) }).exec();
}

// @description - Edits any aspect of the item object and updates to DB
// @param {mongoid} id - the id of the object deleted
// @param {object} info - any subset of the aspects of the Item object
// @return - true on deletion / false
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

// @description - Sets the isFeatured of an object to T or F
// @param {mongoid} id - the id of the object edited
// @param {boolean} featured - object featured boolean
// @return - true on deletion / false
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

module.exports = {
  getAllMenuItems,
  addNewItem,
  deleteItem,
  editItem,
  setFeatured,
};
