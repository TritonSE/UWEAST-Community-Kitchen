/**
 * This file creates the routes to allow for interaction with the orders DB.
 * Contains route find completed orders or find orders based on customer name.
 * Also allows for an order's status to be updated.
 *
 * @summary   Routes to modify the orders DB specifically finding and updating.
 * @author    Thomas Garry
 */
const express = require("express");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const router = express.Router();
const { verify } = require("./services/jwt");
const { addOrder, findOrders, updateStatus } = require("../db/services/order");

// @body - Customer (with Name, Email, Phone), Pickup, Timestamps,
// @body - PayPal(with Amount and transactionID),
// @body - Order (array of objects with item string, quantity and extra array),
// @return -  success:true if order is changed
// router.post(
//   "/insert",
//   [
//     body("Customer").notEmpty(),
//     body("Pickup").notEmpty(),
//     body("PayPal").notEmpty(),
//     body("Timestamps").notEmpty(),
//     body("Order").notEmpty(),
//     isValidated,
//   ],
//   async (req, res, next) => {
//     try {
//       // try to add the order and respond with err msg or success
//       const orderSuccessful = await addOrder(req.body);
//       if (!orderSuccessful) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: "Order unsuccessful" }] });
//       } else {
//         return res.status(200).json({ success: true });
//       }
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server err");
//     }
//   }
// );

/**
 * Finds orders filtered on isCompleted and/or Customer.
 *
 * @body {boolean} isCompleted - T/F based on whether an order is completed (default: false) (not required)
 * @body {object} Customer - contains name, email and phone of customer (not required)
 * @returns {status/object} - 200 success with all orders under the constraints / 500 with err
 */
router.post(
  "/",
  [
    body("token").custom(async (token) => {
      // verify token
      return await verify(token);
    }),
    isValidated,
  ],
  async (req, res, next) => {
    try {
      
      // retrieve all the orders
      const orders = await findOrders();
      
      // error in getting errors, empty orders array returned
      if(!orders){
        return res.status(400).json({
          orders: [],
        });
      }

      // successfully retrieved orders
      return res.status(200).json({
        orders: orders,
      });

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server err");
    }
  }
);

/**
 * Updates the order's isCompleted boolean to the value passed in.
 *
 * @body {string} _id - id of order to be updated
 * @body {object} isCompleted - T/F based on whether an order is completed (default: false)
 * @returns {status/object} - 200 with success / 500 with err
 */
router.post(
  "/updateStatus",
  [body("_id").isString(), 
  body("isCompleted").isBoolean(),  
  body("token").custom(async (token) => {
    // verify token
    return await verify(token);
  }),
   isValidated],
  async (req, res, next) => {
    try {
      const { _id, isCompleted } = req.body;
      // returns updated orders or error if there is an error
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
