const { Email } = require("../models/email");

// change the primary email in the DB
async function changePrimaryEmail(raw_email) {
  try {
    // find and replace the primary email
    let email = await Email.findOneAndUpdate({}, raw_email, { new: true });
    // if there are no emails in database insert one
    if (email === null) {
      email = new Email(raw_email);
      await email.save();
    }
    return email;
  } catch (err) {
    return false;
  }
}

// add secondary email if it doesn't already exist
async function addSecondaryEmail(raw_email) {
  try {
    let email = await Email.findOne(raw_email).exec();
    // if there are no secondary emails with this name in the database insert one
    if (email === null) {
      email = new Email(raw_email);
      await email.save();
    }
    return email;
  } catch (err) {
    return false;
  }
}

// finds the primary email in the DB
async function findPrimaryEmail() {
  return Email.findOne({ isPrimary: true }).exec();
}

// find all emails
async function findAllSecondaryEmails() {
  return Email.find({ isPrimary: false }).exec();
}

// delete email and return true if deleted
async function deleteSecondaryEmail(incomingEmail) {
  let email = await Email.findOne({ email: incomingEmail }).exec();
  if (!email) {
    return false;
  } else {
    await Email.deleteOne({ email: incomingEmail }).exec();
    return true;
  }
}

module.exports = {
  findPrimaryEmail,
  findAllSecondaryEmails,
  deleteSecondaryEmail,
  changePrimaryEmail,
  addSecondaryEmail,
};
