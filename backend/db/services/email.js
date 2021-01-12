const { Email } = require("../models/email");

// if email doesn't exist return err otherwise return email
async function addnewEmail(raw_email) {
  try {
    email = new Email(raw_email);
    await email.save();
    return email;
  } catch (err) {
    return false;
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
