const { Email } = require("../models/email");
const config = require("../../config");

// if email doesn't exist return err otherwise return email
async function addnewEmail(raw_email) {
  let email = await Email.findOne({ email: raw_email.email }).exec();
  if (email) {
    return false;
  } else {
    email = new Email(raw_email);
    await email.save();
    return email;
  }
}

// find all emails
async function findAllEmails() {
  return Email.find({}).exec();
}

// delete email and return true if delete
async function deleteOneEmail(incomingEmail) {
  let email = await Email.findOne({ email: incomingEmail }).exec();
  if (!email) {
    return false;
  } else {
    await Email.deleteOne({ email: incomingEmail }).exec();
    return true;
  }
}

module.exports = {
  addnewEmail,
  findAllEmails,
  deleteOneEmail,
};
