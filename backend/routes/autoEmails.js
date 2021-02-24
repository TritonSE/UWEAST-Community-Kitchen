/**
 * This file adds routes to allow for the sending of automated emails to both customers
 * and emails in the database. All email formats can be seen seperated by functionality
 * inside the emails folder inside of the backend directory. 
 *
 * @summary   Code for routes involved with automated emails. 
 * @author    Amrit Kaur Singh, Dhanush Nanjunda Reddy
 */
const express = require("express");
const nodemailer = require("nodemailer");
const Email = require("email-templates");
const config = require("../config");
const { body } = require("express-validator");
const { findAllEmails } = require("../db/services/email");
const { addOrder } = require("../db/services/order");
const { isValidated } = require("../middleware/validation");

const router = express.Router();

// transporter object for nodemailer
const transporter =
  config.uweast.user === ""
    ? null
    : nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: config.uweast,
      });

// template based sender object
const mail =
  config.uweast.user === ""
    ? null
    : new Email({
        transport: transporter,
        send: true,
        preview: false,
      });

/**
 * Populates given email template with locals and sends it to to_email.
 * All emails are sent from the email account specified in dotenv.
 *
 * @param {string} template - template email
 * @param {string} to_email - the email address being sent to
 * @param {string} locals - the email address being sent to
 * @param {object} res - the response
 * @returns {object} - mail object / err
 */
async function sendEmail(template, to_email, locals, res) {
  // sends email only if mail has been successfully setup
  if (mail != null) {
    await mail.send({
      template: template,
      message: {
        from: config.uweast.user,
        to: to_email,
      },
      locals: locals,
    });
    console.log(`Email ${template} has been sent to ${to_email}.`);
  } else {
    console.log(`Error: Email ${template} could not be sent to ${to_email}.`);
    return res.status(500).send("Server err");
  }
}

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
      sendEmail("customer-email", req.body.Customer.Email, locals, res);

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
      // get all emails inside of Emails DB
      const emails = await findAllEmails();
      // error if no emails exist
      if (!emails.length) {
        return res.status(500).json({ errors: [{ msg: "no emails found" }] });
      }

      // extract the emails from the JSON objects
      let dbemails = emails.map(function (item) {
        return item.email;
      });

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
