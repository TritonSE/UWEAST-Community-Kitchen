const express = require("express");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const router = express.Router();
const { addOrder, findOrders, updateStatus } = require("../db/services/order");

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
    try {
      // try to add the order and respond with err msg or success
      const orderSuccessful = await addOrder(req.body);
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
router.post(
  "/",
  [
    body("isCompleted").notEmpty().optional(),
    body("Customer").notEmpty().optional(),
    isValidated,
  ],
  async (req, res, next) => {
    try {
      const { isCompleted, Customer } = req.body;
      // returns emails or error if there is an error
      const orders = await findOrders(isCompleted, Customer);
      res.status(200).json({
        orders: orders,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server err");
    }
  }
);

// @body: startDate, endDate
// returns emails between the given dates
router.post(
  "/updateStatus",
  [body("_id").isString(), body("isCompleted").isBoolean(), isValidated],
  async (req, res, next) => {
    try {
      const { _id, isCompleted } = req.body;
      // returns emails or error if there is an error
      const orders = await updateStatus(_id, isCompleted);
      if (orders === false) {
        return res.status(400).json({
          response: "id does not exist/ failure",
        });
      }
      res.status(200).json({
        success: orders.ok,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server err");
    }
  }
);

module.exports = router;
