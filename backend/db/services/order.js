/**
 * This file allows for interaction with the order DB.
 * Contains methods that add and update an order as well
 * as find orders.
 *
 * @summary   Creation of interaction with order DB.
 * @author    Thomas Garry
 */
const mongodb = require("mongodb");
const { Order } = require("../models/order");

/**
 * Saves order to DB with information such as Customer (with Name,
 * Email and Phone), Pickup (time), Paypal (Amount and transactionID),
 * the order information itself, etc.
 *
 * @param {object} raw_order - order object to be added
 * @returns {object/boolean} - order object / false on error
 */
async function addOrder(raw_order) {
  try {
    order = new Order(raw_order);
    await order.save();
    return order;
  } catch (err) {
    return false;
  }
}

/**
 * Edits an order's isCompleted to signify that an order is
 * completed or not.
 *
 * @param {string} id - the id of the order to be modified
 * @param {boolean} update - true or false value to set to isCompleted
 * @returns {object/boolean} - updated order / false on error
 */
async function updateStatus(id, update) {
  try {
    return await Order.updateOne(
      { _id: new mongodb.ObjectID(id) },
      { $set: { isCompleted: update } }
    ).exec();
  } catch (err) {
    return false;
  }
}

/**
 * Find all orders in collection.
 *
 * @returns {[object]/boolean} - found order(s) / false on error
 */
async function findOrders() {
  try {
    return Order.find({}).exec();
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = {
  addOrder,
  findOrders,
  updateStatus,
};
