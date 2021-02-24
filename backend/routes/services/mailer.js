/**
 * This file adds routes to allow for the sending of automated emails to both customers
 * and emails in the database. All email formats can be seen seperated by functionality
 * inside the emails folder inside of the backend directory. 
 *
 * @summary   Code for routes involved with automated emails. 
 * @author    Dhanush Nanjunda Reddy, Amrit Kaur Singh
 */
const nodemailer = require("nodemailer");
const config = require("../../config");
const Email = require("email-templates");


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
 * @param {string} to_email - the email address(es) being sent to
 * @param {string} locals - information that will populate the email template
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

module.exports = {
    sendEmail
};
  