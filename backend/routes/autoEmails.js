const express = require('express');
const nodemailer = require("nodemailer");
const Email = require('email-templates');
const config = require('../config');
const { findAllEmails } = require("../db/services/email");
const { addOrder } = require('../db/services/order');

const router = express.Router();

//Define any needed helper function here 
const transporter = config.uweast.user === "" ? null : nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: config.uweast
});

const mail = config.uweast.user === "" ? null : new Email({
  transport: transporter,
  send: true,
  preview: false
});

async function sendEmail(template, to_email, req, res) {
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
        date: req.body.Pickup,
        order: req.body.Order
      }
    });
    console.log(`Email ${template} has been sent to ${to_email}.`);
  } else {
    res.status(400).send("Error occurred");
    console.log(`Email ${template} would have been sent to ${to_email} but is disabled.`);
  }
}

router.post('/automate', async (req, res, next) => {
  // Assume req.body looks like this:
  // {
  //   "email": "",
  //   "name": "",
  //   "phone": "",
  //   "date": Date,
  //   "order": [
  //     {
  //       "name": "",
  //       "quantity": Number,
  //       "description": ""
  //     }
  //   ]
  // }

  try {
    const order = await addOrder(req.body);
    if (!order) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Order unsuccessful" }] });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server err");
  }

  try {
    const emails = await findAllEmails();
    if (!emails.length) {
      return res.status(400).json({ errors: [{ msg: "no emails found" }] });
    } else {
      sendEmail('uweast-receipt', emails[0].email, req, res);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server err");
  }

  sendEmail('customer-email', req.body.Customer.Email, req, res);
  return res.status(200).send();
});



module.exports = router;