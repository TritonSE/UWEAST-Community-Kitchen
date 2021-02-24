/**
 * This file adds routes to allow for the sending of automated emails to both customers
 * and emails in the database. All email formats can be seen seperated by functionality
 * inside the emails folder inside of the backend directory. 
 *
 * @summary   Code for routes involved with sending automated emails. 
 * @author    Amrit Kaur Singh, Dhanush Nanjunda Reddy
 */

const express = require("express");
const { body } = require("express-validator");
const { findAllEmails, findPrimaryEmail } = require("../db/services/email");
const {sendEmail} = require("../routes/services/mailer");
const { addOrder } = require("../db/services/order");
const { isValidated } = require("../middleware/validation");

const router = express.Router();

/**
 * Adds the order to the Orders DB and also sends order receipts to customer's specified email
 * as well as all UWEAST emails registered in Emails DB.
 *
 * @body - requires the Customer, PickUp, PayPal, and Order information retrieved via Checkout process
 * @returns {status/object} - if everything goes successful, returns
 *                            a 200 status, else returns some error status
 */
router.post(
  "/automate",
  [
    body("Customer").notEmpty(),
    body("Pickup").notEmpty(),
    body("PayPal").notEmpty(),
    body("Order").notEmpty(),
    isValidated,
  ],
  async (req, res, next) => {
    // Assume req.body looks like this:
    // {
    //   "Customer": {
    //     "Name": "",
    //     "Email": "",
    //     "Phone": ""
    //   },
    //   "Pickup": Date,
    //   "Paypal": {
    //     "Amount": "0.04",
    //     "transactionID": ""
    //   },
    //   "Order": [
    //     {
    //       "item": "",
    //       "quantity": Number,
    //       "extra": [""]
    //     }
    //   ]
    // }

    try {
      // attempt to add order into Orders DB
      const order = await addOrder(req.body);
      // error Status if order could not be added
      if (!order) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Order unsuccessful" }] });
      }

      // retrieve all emails inside of Emails DB
      const emails = await findAllEmails();
      if (!emails.length) {
        return res.status(400).json({ errors: [{ msg: "no emails found" }] });
      }

      dbemail = emails.map(function (item) {
        return item.email;
      });

      let locals = {
        name: req.body.Customer.Name,
        number: req.body.Customer.Phone,
        email: req.body.Customer.Email,
        date: new Date(req.body.Pickup).toLocaleDateString(),
        time: new Date(req.body.Pickup).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        order: req.body.Order,
        dbemail: dbemail,
      };

      // send UWEAST an order receipt
      sendEmail("uweast-receipt", dbemail, locals, res);

      // send customer copy of order receipt
      sendEmail("customer-receipt", req.body.Customer.Email, locals, res);

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server err");
    }
  }
);

/**
 * Sends an email to all individuals inside of the Emails DB with the form information.
 *
 * @body - requires the name, email, and message of the indivdual who is seeking to contact UWEAST via the
 *         form on the Contact page
 * @returns {status/object} - successfully sent email sends a 200 status / unsuccessful an error status is sent
 */
router.post(
  "/contact",
  [
    body("name").notEmpty().isString(),
    body("email").notEmpty().isString().isEmail(),
    body("message").notEmpty().isString(),
    isValidated,
  ],
  async (req, res, next) => {
    try {
      // get primary email from collection
      const emails = await findPrimaryEmail();

      // error if no emails exist
      if (!emails) {
        return res.status(500).json({ errors: [{ msg: "no emails found" }] });
      }

      // extract the emails from the JSON objects
      let dbemails = emails.email;

      let locals = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
      };

      // send UWEAST a notification that someone wants to contact them
      sendEmail("contact-message", dbemails, locals, res);

      return res.status(200).json({ success: true });

    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server err");
    }
  }
);

module.exports = router;
