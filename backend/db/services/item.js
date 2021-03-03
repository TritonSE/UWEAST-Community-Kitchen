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
 * Returns all menuItems, false upon err.
 *
 * @returns {[object]} - Array of menuitems / [] (empty) / err
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
 * @param {object} info - Object to be inserted into the DB
 * @returns {object/boolean} - Created item / false
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
 * @param {string} id - The id of the object deleted
 * @returns {object} - The deleted object result
 */
async function deleteItem(id) {
  return await Item.deleteOne({ _id: new mongodb.ObjectID(id) }).exec();
}

/**
 * Edits any aspect of the item object and updates to DB.
 *
 * @param {string} id - The id of the object edited
 * @param {object} info - Any subset of the aspects of the item object
 * @returns {object/boolean} - The updated item object / false on err
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
 * @param {string} id - The id of the object featured / not featured
 * @param {boolean} featured - Object featured boolean
 * @returns {object/boolean} - The updated item object / false on err
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

/**
 * Retrieves the corresponding Item JSON given an item id. 
 *
 * @param {string} id - The id of the item object
 * @returns {object/boolean} - The queried item object / false on err
 */
async function getItemById(id) {
  try {
    return Item.find({_id: new mongodb.ObjectID(id)}).exec();
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
  getItemById
};
