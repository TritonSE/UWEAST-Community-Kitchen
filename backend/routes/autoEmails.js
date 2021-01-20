const express = require('express');
const nodemailer = require("nodemailer");
const Email = require('email-templates');
const config = require('../config');

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
  if(mail != null) {
    await mail.send({
      template: template,
      message: {
        from: config.uweast.user,
        to: to_email
      },
      locals: {
        name: req.body.name,
        number: req.body.phone,
        email: req.body.email,
        date: req.body.date,
        order: req.body.order
      }
    });
    console.log(`Email ${template} has been sent to ${to_email}.`);
  } else {
    res.status(400).send("Error occurred");
    console.log(`Email ${template} would have been sent to ${to_email} but is disabled.`);
  }
}

router.post('/automate', (req, res, next) => {
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

    sendEmail('customer-email', req.body.email, req, res);
    sendEmail('uweast-receipt', config.uweast.user, req, res);
    res.status(200).send();
  });



module.exports = router;