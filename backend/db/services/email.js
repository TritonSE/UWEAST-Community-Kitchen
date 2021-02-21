/**
 * This file allows for interaction with the Email DB.
 * Contains methods that find the primary email, find the secondary emails,
 * delete a secondary email, change the primary email, and a secondaryEmail.
 */
const { raw } = require("express");
const { Email } = require("../models/email");

// @description - change the primary email in the DB
// @return - Mongo object email or false on duplicate/error
async function changePrimaryEmail(raw_email) {
  try {
    // find and replace the primary email
    let email = await Email.findOneAndUpdate({ isPrimary: true }, raw_email);
    // if there are no emails in database insert one
    if (email === null) {
      email = new Email(raw_email);
      await email.save();
    }
    // duplicate insertion
    else if (email.email === raw_email.email) {
      return false;
    }
    return email;
  } catch (err) {
    return false;
  }
}

// @description - add secondary email if it doesn't already exist
// @return - Mongo Object for email or false on failure/duplicate
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

// @description - finds the primary email in the DB
// @return - Mongo Object for primary email / null
async function findPrimaryEmail() {
  return Email.findOne({ isPrimary: true }).exec();
}

// @description - finds the primary email in the DB
// @return - Array of Mongo Objects for secondary emails
async function findAllSecondaryEmails() {
  return Email.find({ isPrimary: false }).exec();
}

// @description - delete secondary email
// @return - true on deletion / false
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
