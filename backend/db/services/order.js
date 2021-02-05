const mongodb = require("mongodb");
const { Order } = require("../models/order");

// save order to DB
async function addOrder(raw_order) {
  try {
    order = new Order(raw_order);
    await order.save();
    return order;
  } catch (err) {
    return false;
  }
}

// update isCompleted
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

// find orders based on isCompleted and/or Customer
async function findOrders(o_isCompleted, Customer) {
  try {
    if (Customer !== undefined) {
      if (o_isCompleted !== undefined) {
        // return all orders based on customer name and whether it is completed
        return Order.find({
          "Customer.Name": Customer.Name,
          isCompleted: o_isCompleted,
        }).exec();
      }
      // return all orders based on customer name
      return Order.find({
        "Customer.Name": Customer.Name,
      }).exec();
    }

    // if isCompleted is not passed in return all orders
    if (o_isCompleted === undefined) {
      return Order.find({}).exec();
    } else {
      // return all orders based on isCompleted T/F
      return Order.find({
        isCompleted: o_isCompleted,
      }).exec();
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = {
  addOrder,
  findOrders,
  updateStatus,
};
