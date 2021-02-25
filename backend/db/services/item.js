/**
 * This file allows for interaction with the Item DB.
 * Contains methods that find all menu items, add new items,
 * delete an item, edit an item, and set an item to be featured.
 *
 * @summary   Creation of interaction with Item DB.
 * @author    Thomas Garry
 */
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const { Item } = require("../models/item");

/**
 * Returns all menuItems, false upon err
 *
 * @returns {[object]} - array of menuitems / [] (empty) / err
 */
async function getAllMenuItems() {
  try {
    return Item.find({}).exec();
  } catch (err) {
    return false;
  }
}

/**
 * Adds a new item object to the Item DB.
 *
 * @param {object} info - object to be inserted into the DB
 * @returns {object/boolean} - created item / false
 */
async function addNewItem(info) {
  try {
    return Item.create(info);
  } catch (err) {
    return false;
  }
}

/**
 * Deletes the item specified by id from the Item DB.
 *
 * @param {string} id - the id of the object deleted
 * @returns {object} - the deleted object result
 */
async function deleteItem(id) {
  return await Item.deleteOne({ _id: new mongodb.ObjectID(id) }).exec();
}

/**
 * Edits any aspect of the item object and updates to DB.
 *
 * @param {string} id - the id of the object edited
 * @param {object} info - any subset of the aspects of the item object
 * @returns {object/boolean} - the updated item object / false on err
 */
async function editItem(id, info) {
  try {
    // edit the item
    return await Item.updateOne(
      { _id: new mongodb.ObjectID(id) },
      { $set: info }
    ).exec();
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * Sets the isFeatured of an object to true or false.
 *
 * @param {string} id - the id of the object featured / not featured
 * @param {boolean} featured - object featured boolean
 * @returns {object/boolean} - the updated item object / false on err
 */
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
