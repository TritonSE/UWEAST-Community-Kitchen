/**
 * This file initializes the mailing service used for all emails sent on the website. 
 * It also contains a single function that allows for the sending of "automated"
 * emails using the information passed to it in conjunction with the pre-made
 * email-templates. All email formats can be seen seperated by functionality
 * inside the emails folder inside of the backend directory. 
 *
 * @summary   Code for initializing mailing system and sending emails. 
 * @author    Dhanush Nanjunda Reddy, Amrit Kaur Singh
 */
const nodemailer = require("nodemailer");
const config = require("../../config");
const Email = require("email-templates");
const logger = require('../../logger/winston');


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
 * @param {string} template - Template email
 * @param {string} to_email - Email address(es) being sent to
 * @param {string} locals - Information that will populate the email template
 * @param {object} res - Response
 * @returns {object} - Mail object / err
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
      // log emails successfully sent
      logger.error(`Email ${template} has been sent to ${to_email}.`);
      console.log(`Email ${template} has been sent to ${to_email}.`);
    } else {
      logger.error(`Error: Email ${template} could not be sent to ${to_email}.`);
      console.error(`Error: Email ${template} could not be sent to ${to_email}.`);
      throw 500;
      //return res.status(500).send("Server err");
    }
  }

module.exports = {
    sendEmail
};
  