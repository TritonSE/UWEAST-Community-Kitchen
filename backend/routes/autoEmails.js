const express = require('express');
const nodemailer = require("nodemailer");
const Email = require('email-templates');
const config = require('../config');
const { body } = require("express-validator");
const { findAllEmails } = require("../db/services/email");
const { addOrder } = require('../db/services/order');
const { isValidated } = require("../middleware/validation");

const router = express.Router();

//transporter object for nodemailer
const transporter = config.uweast.user === "" ? null : nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: config.uweast
});

//template based sender object
const mail = config.uweast.user === "" ? null : new Email({
  transport: transporter,
  send: true,
  preview: false
});

//Populates given email template with req.body and sends it to to_email
async function sendEmail(template, to_email, uw_email, req, res) {
  if (mail != null) {
    await mail.send({
      template: template,
      message: {
        from: config.uweast.user,
        to: to_email
      },
      locals: {
        name: req.body.Customer.Name,
        number: req.body.Customer.Phone,
        email: req.body.Customer.Email,
        date: new Date(req.body.Pickup).toLocaleDateString(),
        time: new Date(req.body.Pickup).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}),
        order: req.body.Order,
        dbemail: uw_email
      }
    });
    console.log(`Email ${template} has been sent to ${to_email}.`);
  } else {
    return res.status(500).send("Server err");
  }
}

//sends automated emails and returns success:true if successful
router.post('/automate', 
  [
    body("Customer").notEmpty(),
    body("Pickup").notEmpty(),
    body("PayPal").notEmpty(),
    body("Order").notEmpty(),
    isValidated,
  ], async (req, res, next) => {
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

  //adds order passed in request body to the database
  try {
    const order = await addOrder(req.body);
    if (!order) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Order unsuccessful" }] });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server err");
  }

  var dbemail = "";

  //query db for emails and send uweast copy of order receipt
  try {
    const emails = await findAllEmails();
    if (!emails.length) {
      return res.status(400).json({ errors: [{ msg: "no emails found" }] });
    } else {
      dbemail = emails[0].email;
      sendEmail('uweast-receipt', dbemail, dbemail, req, res);
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server err");
  }

  //send customer copy of order receipt
  sendEmail('customer-email', req.body.Customer.Email, dbemail, req, res);

  return res.status(200).json({success: true});
});



module.exports = router;