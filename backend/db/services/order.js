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

// find orders based on start and end dates
async function findOrders(startDate, endDate) {
  try {
    // if the startDate and endDate are not given return all orders
    if (startDate === undefined && endDate == undefined) {
      return Order.find({}).exec();
    } else if (startDate === undefined) {
      return Order.find({
        Pickup: {
          $lte: endDate,
        },
      }).exec();
    } else if (endDate === undefined) {
      return Order.find({
        Pickup: {
          $gte: startDate,
        },
      }).exec();
    }
    // return orders between startDate and endDate
    return Order.find({
      Pickup: {
        $gte: startDate,
        $lte: endDate,
      },
    }).exec();
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = {
  addOrder,
  findOrders,
};
