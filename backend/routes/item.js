const express = require('express');
const db = require('../db');

const router = express.Router();

/** To-Do: remove renders with status code responses +  urlPaths + dummy functions in all files  + Mongoose connection, 
 * Assignment: Users DB - compare function + register & verify routes (1st), emails DB (2nd)*/

function buildItemJSON(body) {
    body.vegan = body.vegan !== undefined;
    body.vegetarian = body.vegetarian !== undefined;
    body.glutenFree = body.glutenFree !== undefined;
    body.ingredients = body.ingredients.split(', ');
    body.price = parseFloat(body.price);
  
    return body;
  }
  
  // Regular get, no params or extra routing.
  router.get('/', (req, res, next) => {
    const items = [];
    db.getAllMenuItems().then((allItems) => {
      for (const key in allItems) {
        const childData = allItems[key];
        items.push(childData);
      }
      res.status(200).json({items: items});
    }).catch((error) => {res.sendStatus(error.status || 500);});
  });
  
  // Post data, log data to terminal.
  router.post('/insert', (req, res, next) => {
    db.addNewItem(buildItemJSON(req.body));
    res.sendStatus(200);
  });
  
  router.post('/remove', (req, res, next) => {
    db.deleteItem(req.body.id);
    res.sendStatus(200);
  });
  
  router.post('/edit', (req, res, next) => {
    db.editItem(req.body.id, buildItemJSON(req.body));
    res.sendStatus(200);
  });
  
  router.post('/feature', (req, res, next) => {
    db.getAllMenuItems().then((allItems) => {
      for (const key in allItems) {
        if (req.body[allItems[key]._id]) db.setFeatured(allItems[key]._id);
        else db.setNotFeatured(allItems[key]._id);
      }
    res.sendStatus(200);
    }).catch((error) => {res.sendStatus(error.status || 500);});
  });
  
  module.exports = router;