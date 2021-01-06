const express = require('express');
const { getAllMenuItems } = require("../db/services/item");
//const log = require('../../logger');

const router = express.Router();

class Info {
  constructor(id, items, subtotal, tax, total) {
    this.id = id;
    this.items = items;
    this.subtotal = subtotal;
    this.tax = tax;
    this.total = total;
  }
}

function getCart(req) {
  try {
    const { cart } = req.cookies;
    return cart;
  } catch (TypeError) {
    return [];
  }
}

function updateCart(req, res) {
  let cart = getCart(req);
  if (cart === undefined) cart = [];
  cart.push(req.body.item);
  res.cookie('cart', cart);
  res.status(200).send();
}

function removeCartItem(req, res) {
  const cart = getCart(req);
  /* Make sure to implement check for null cart
      in remove call from menu.js */
  const index = parseInt(req.body.index, 10);
  cart.splice(index, 1);
  res.cookie('cart', cart);
  res.status(200).send();
}

// Regular get, no params or extra routing.
router.get('/', (req, res, next) => {
  const items = [];
  let cart = getCart(req);
  if (cart === undefined) cart = [];

  getAllMenuItems().then((allItems) => {
    for (const key in allItems) {
      const childData = allItems[key];
      items.push(childData);
    }
    res.status(200).send({items: items});
  }).catch((error) => {
    // log.error(error);
    res.sendStatus(error.status || 500);
  });
});

function removeAllCartItem(req, res) {
  const cart = getCart(req);
  cart.splice(0, cart.length);
  res.cookie('cart', cart);
}

/**
 * Post request for adding menu item to cart
 */
router.post('/addCart', (req, res) => {
  updateCart(req, res);
  res.status(200).send();
});

/**
 * Post request for removing menu item from cart
 */
router.post('/removeCart', (req, res) => {
  removeCartItem(req, res);
  res.status(200).send();
});

router.post('/removeAll', (req, res) => {
  removeAllCartItem(req, res);
  res.status(200).send();
});
/**
 * Post request for requesting the JSON of the current cart
 */
router.post('/getCart', (req, res) => {
  let cart = getCart(req);
  if (cart === undefined) cart = [];
  res.status(200).send({cart: cart })
  // res.jsonp({ cart });
});


module.exports = router;
