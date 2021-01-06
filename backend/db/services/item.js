const mongoose = require('mongoose');
const mongodb = require('mongodb');
const { Item } = require('../models/item');

//Example of how to write queries/updates: https://github.com/TritonSE/tse-recruitment-backend/blob/master/services/applications.js


function getAllMenuItems() {
  return Item.find({}).exec();
}

function itemFromInfo(info) {
  return {
    name: info.name,
    description: info.description,
    price: info.price,
    category: info.category,
    image: info.image,
    cuisine: info.cuisine,
    tags: info.tags,
    vegan: info.vegan,
    vegetarian: info.vegetarian,
    glutenFree: info.glutenFree,
    ingredients: info.ingredients,
  };
}

function addNewItem(info) {
  Item.create(itemFromInfo(info));
}

function deleteItem(id) {
  Item.deleteOne({ _id: new mongodb.ObjectID(id) }, (err, results) => {});
}

function editItem(id, info) {
  Item.updateOne({ _id: new mongodb.ObjectID(id) },
    { $set: itemFromInfo(info) },
    (err, results) => {});
}

function setFeatured(id) {
  Item.updateOne({ _id: new mongodb.ObjectID(id) },
    { $set: { featured: true } },
    (err, results) => {});
}

function setNotFeatured(id) {
  Item.updateOne({ _id: new mongodb.ObjectID(id) },
    { $set: { featured: false } },
    (err, results) => {});
}

module.exports = { 
    getAllMenuItems,
    addNewItem,
    deleteItem,
    editItem,
    setFeatured,
    setNotFeatured };