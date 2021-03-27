/**
 * This file allows for interaction with the order DB.
 * Contains methods that add and update an order as well
 * as find orders.
 *
 * @summary   Creation of interaction with order DB.
 * @author    Thomas Garry, Amrit Kaur Singh
 */
const mongodb = require("mongodb");
const { Order } = require("../models/order");

/**
 * Saves order to DB with information such as Customer (with Name,
 * Email and Phone), Pickup (time), Paypal (Amount and transactionID),
 * the order information itself, etc.
 *
 * @param {object} raw_order - Order object to be added
 * @returns {object/boolean} - Order object / false on error
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
 * @param {string} id - The id of the order to be modified
 * @param {boolean} update - True or false value to set to isCompleted
 * @returns {object/boolean} - Updated order / false on error
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
 * @returns {[object]/boolean} - Found order(s) / false on error
 */
async function findOrders() {
  try {
    return Order.find({}).exec();
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * Delete a particular order in the collection, given its unique order id.
 *
 * @returns {[object]/boolean} - Found order(s) / false on error
 */
async function deleteOrder(id) {

  try {
    return  Order.findOneAndDelete({_id: new mongodb.ObjectID(id)});
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * Retrieve a particular order using its PayPal transaction id. 
 *
 * @returns {[object]/boolean} - Found order / false on error
 */
async function findOrderByTid(tid) {

  try {
    return await Order.findOne({ 'PayPal.transactionID': tid }).exec();
  } catch (err) {
    return false;
  }
}

/**
 * Edits an order's PayPal status to signify its verification after 
 * PayPal IPN gets through. 
 *
 * @param {string} id - The id of the order to be modified
 * @param {Number} status - 0 indicates pending (default), 1 indicates approval, 2 indicates disapproval
 * @returns {object/boolean} - Updated order / false on error
 */
async function updatePayPalStatus(id, status) {
  try {
    return await Order.updateOne(
      { _id: new mongodb.ObjectID(id) },
      { $set: { 'PayPal.status': status } }
    ).exec();
  } catch (err) {
    return false;
  }
}


module.exports = {
  addOrder,
  findOrders,
  updateStatus,
  deleteOrder,
  findOrderByTid,
  updatePayPalStatus
};
