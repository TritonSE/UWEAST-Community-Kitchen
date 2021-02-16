// this file allows for interaction with the Email DB
// with methods that find the primary email, find the secondary emails,
// delete a secondary email, change the primary email, and a secondaryEmail
const { Email } = require("../models/email");

// @return: Mongo object email or false on duplicate/error
// @description: change the primary email in the DB
async function changePrimaryEmail(raw_email) {
  try {
    // find and replace the primary email
    let email = await Email.findOneAndUpdate({ isPrimary: true }, raw_email, {
      new: true,
    });
    // if there are no emails in database insert one
    if (email === null) {
      email = new Email(raw_email);
      await email.save();
      return email;
    } else {
      // duplicate insertion
      return false;
    }
  } catch (err) {
    return false;
  }
}

// @return: Mongo Object for email or false on failure/duplicate
// @description: add secondary email if it doesn't already exist
async function addSecondaryEmail(raw_email) {
  try {
    let email = await Email.findOne(raw_email).exec();
    // if there are no secondary emails with this name in the database insert one
    if (email === null) {
      email = new Email(raw_email);
      await email.save();
      return email;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

// @return: Mongo Object for primary email / null
// @decsription: finds the primary email in the DB
async function findPrimaryEmail() {
  return Email.findOne({ isPrimary: true }).exec();
}

// @return: Array of Mongo Objects for secondary emails
// @decsription: finds the primary email in the DB
async function findAllSecondaryEmails() {
  return Email.find({ isPrimary: false }).exec();
}

// @return: true on deletion / false
// @decsription: delete secondary email
async function deleteSecondaryEmail(incomingEmail) {
  let email = await Email.findOne({
    email: incomingEmail,
    isPrimary: false,
  }).exec();
  // if there is no email found return false
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
