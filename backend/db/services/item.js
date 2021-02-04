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

// rounds price to two decimal places or false if undefined
function priceSet(num) {
  if (num !== undefined && num.indexOf(".") !== -1) {
    return num.substring(0, num.indexOf(".") + 3);
  }
  return false;
}

// @body: info conforming to the item schema
// adds a new item object to the Item DB
async function addNewItem(info) {
  try {
    let family = false;
    let individual = false;

    // round prices if they exist
    if (info.Prices !== undefined) {
      family = priceSet(info.Prices.Family);
      individual = priceSet(info.Prices.Individual);
    }

    // if prices exist set them to be apart of the creation (with their rounded values)
    if (family !== false) {
      info.Prices.Family = family;
    }
    if (individual !== false) {
      info.Prices.Individual = individual;
    }
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
    let family = false;
    let individual = false;

    // round prices if they exist
    if (info.Prices !== undefined) {
      family = priceSet(info.Prices.Family);
      individual = priceSet(info.Prices.Individual);
    }

    // if prices exist set them to be edited
    if (family !== false) {
      info.Prices.Family = family;
    }
    if (individual !== false) {
      info.Prices.Individual = individual;
    }

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
