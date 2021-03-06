/**
 * This file creates the routes to allow for interaction with the orders DB.
 * Contains route find completed orders or find orders based on customer name.
 * Also allows for an order's status to be updated.
 *
 * @summary   Routes to modify the orders DB specifically finding and updating.
 * @author    Thomas Garry, Amrit Kaur Singh
 */
const express = require("express");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const { verify } = require("./services/jwt");
const { findAllEmails, findPrimaryEmail } = require("../db/services/email");
const { sendEmail } = require("./services/mailer");
const { deleteOrder, findOrders, updateStatus, editOrder } = require("../db/services/order");

const router = express.Router();

/**
 * Finds orders filtered on isCompleted and/or Customer.
 *
 * @body {string} token - Admin token to verify for authorization
 * @returns {status/object} - 200 success with all orders under the constraints / 500 with err
 */
router.post(
  "/",
  [
    body("token").custom(
      async (token) =>
        // verify token
        await verify(token)
    ),
    isValidated,
  ],
  async (req, res, next) => {
    try {
      // retrieve all the orders
      const orders = await findOrders();

      // error in getting errors, empty orders array returned
      if (!orders) {
        return res.status(400).json({
          orders: [],
        });
      }

      // successfully retrieved orders
      return res.status(200).json({
        orders,
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
 * @body {string} _id - Id of order to be updated
 * @body {object} isCompleted - T/F based on whether an order is completed (default: false)
 * @body {string} token - Admin token to verify for authorization
 * @returns {status/object} - 200 with success / 500 with err
 */
router.post(
  "/updateStatus",
  [
    body("_id").isString(),
    body("isCompleted").isInt(),
    body("token").custom(
      async (token) =>
        // verify token
        await verify(token)
    ),
    isValidated,
  ],
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

/**
 * Sends an email to all individuals inside of the Emails DB with the form information.
 *
 * @body - Requires the order id of order to remove, admin token for authorization, and an indication of whether
 *         cancellation receipts must be sent to either customer or admins.
 * @returns {status/object} - Successfully removed order sends a 200 status / unsuccessful an error status is sent
 */
router.delete(
  "/cancelOrder",
  [
    body("_id").isString(),
    body("customerReceipt").isBoolean(),
    body("adminReceipt").isBoolean(),
    body("token").custom(
      async (token) =>
        // verify token
        await verify(token)
    ),
    isValidated,
  ],
  async (req, res, next) => {
    try {
      // try to add the order and respond with err msg or success
      const removedOrder = await deleteOrder(req.body._id);

      if (!removedOrder) {
        return res.status(400).json({ errors: [{ msg: "Order could not be removed" }] });
      }

      let isCustomerError = false;
      let isUWEASTError = false;

      // send customer cancellation receipt
      if (req.body.customerReceipt) {
        // get primary email from collection
        const primaryEmail = await findPrimaryEmail();

        // only send email if there is a primary email in the DB
        if (!primaryEmail) {
          isCustomerError = true;
        } else {
          const locals = {
            name: removedOrder.Customer.Name,
            date: new Date(removedOrder.Pickup).toLocaleDateString(),
            time: new Date(removedOrder.Pickup).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            order: removedOrder.Order,
            amount: removedOrder.PayPal.Amount,
            transactionID: removedOrder.PayPal.transactionID,
            primaryEmail: primaryEmail.email,
          };

          // send customer of removed order a cancellation receipt
          isCustomerError = !(await sendEmail(
            "customer-cancellation",
            removedOrder.Customer.Email,
            locals,
            res
          ));
        }
      }

      // send admins cancellation receipt
      if (req.body.adminReceipt) {
        // retrieve all emails inside of Emails DB
        const emails = await findAllEmails();
        if (!emails.length) {
          return res.status(400).json({ errors: [{ msg: "no emails found" }] });
        }

        dbemails = emails.map((item) => item.email);

        // only send email if there are recipient emails in the DB
        if (!dbemails) {
          isUWEASTError = true;
        } else {
          const locals = {
            name: removedOrder.Customer.Name,
            email: removedOrder.Customer.Email,
            number: removedOrder.Customer.Phone,
            date: new Date(removedOrder.Pickup).toLocaleDateString(),
            time: new Date(removedOrder.Pickup).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            order: removedOrder.Order,
            amount: removedOrder.PayPal.Amount,
            transactionID: removedOrder.PayPal.transactionID,
            notes: removedOrder.Notes,
          };

          // send UWEAST cancellation receipt for records
          isUWEASTError = !(await sendEmail("uweast-cancellation", dbemails, locals, res));
        }
      }

      let msg;

      // message customization, dependent on any errors in sending emails
      if (isCustomerError && isUWEASTError) {
        msg =
          "Order successfully deleted. However, no email cancellations were sent out due to an internal error.";
      } else if (isCustomerError) {
        msg =
          "Order successfully deleted. However, an email cancellation could not be sent to the customer due to an internal error.";
      } else if (isUWEASTError) {
        msg =
          "Order successfully deleted. However, an email cancellation could not be sent to admin emails due to an internal error.";
      } else {
        msg = "Order successfully deleted!";
      }

      return res.status(200).json({ msg });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
  }
);

/**
 * Edits any of the item attributes, the only required attribute is _id.
 *
 * @body {string} _id - Id of object to be edited and
 *                Prices, Accommodations, etc - any of the attributes
 *                of the item object to be edited
 * @body {string} token - Admin token to verify for authorization
 * @returns {status/object} - 200 with success / 400 err
 */
router.post(
  "/editOrder",
  [
    body("_id").notEmpty(),
    body("Customer").notEmpty().optional(),
    body("Pickup").notEmpty().optional(),
    body("Notes").isString().optional(),
    body("token").custom(
      async (token) =>
        // verify token
        await verify(token)
    ),
    isValidated,
  ],
  async (req, res, next) => {
    const edit = await editOrder(req.body._id, req.body);
    // if there is an error or item is not found
    if (edit === false || (edit && edit.n !== 1)) {
      console.log("Bad edit");
      res.status(400).json({ errors: [{ msg: "edit unsuccessful/ not found" }] });
    } else {
      res.status(200).json({ success: true });
    }
  }
);

module.exports = router;
