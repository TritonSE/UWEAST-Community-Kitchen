const express = require("express");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const router = express.Router();
const { addOrder, findOrders } = require("../db/services/order");

// @body: Customer (with Name, Email, Phone), Pickup, Timestamps,
// @body: PayPal(with Amount and transactionID),
// @body: Order (array of objects with item string, quantity and extra array),
// returns success:true if order is changed
router.post(
  "/insert",
  [
    body("Customer").notEmpty(),
    body("Pickup").notEmpty(),
    body("PayPal").notEmpty(),
    body("Timestamps").notEmpty(),
    body("Order").notEmpty(),
    isValidated,
  ],
  async (req, res, next) => {
    const { Customer, Pickup, Timestamps, PayPal, Order } = req.body;
    try {
      // try to add the order and respond with err msg or success
      orderJson = {
        Customer: Customer,
        Pickup: Pickup,
        Timestamps: Timestamps,
        PayPal: PayPal,
        Order: Order,
      };
      const orderSuccessful = await addOrder(orderJson);
      if (!orderSuccessful) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Order unsuccessful" }] });
      } else {
        return res.status(200).json({ success: true });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server err");
    }
  }
);

// @body: startDate, endDate
// returns emails between the given dates
router.get(
  "/",
  [
    body("startDate").isISO8601().optional(),
    body("endDate").isISO8601().optional(),
    isValidated,
  ],
  async (req, res, next) => {
    try {
      const { startDate, endDate } = req.body;
      // returns emails or error if there is an error
      const orders = await findOrders(startDate, endDate);
      res.status(200).json({
        orders: orders,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server err");
    }
  }
);

module.exports = router;
