/**
 * File allows for interaction with the Email DB.
 * Contains methods that find the primary email, find the secondary emails,
 * delete a secondary email, change the primary email, and a secondaryEmail.
 *
 * @summary   Creation of interaction with Email DB.
 * @author    Thomas Garry
 */
const { raw } = require("express");
const { Email } = require("../models/email");

/**
 * Change the primary email in the DB to the passed in object.
 *
 * @param {object} raw_email - Json representing the primary email to store
 * @returns {object/boolean} - Mongo object email or false on duplicate/error
 */
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

/**
 * Add secondary email if it doesn't already exist.
 *
 * @param {object} raw_email - json representing the primary email to store
 * @returns {object/boolean} - Mongo object email or false on duplicate/error
 */
async function addSecondaryEmail(raw_email) {
  try {
    let email = await Email.findOne(raw_email).exec();
    // if there are no secondary emails with this name in the database insert one
    if (email === null) {
      email = new Email(raw_email);
      await email.save();
      return email;
    }
    return false;
  } catch (err) {
    return false;
  }
}

/**
 * Finds the primary email in the DB.
 *
 * @returns {object/nul} - Mongo Object for primary email / null
 */
async function findPrimaryEmail() {
  return await Email.findOne({ isPrimary: true }).exec();
}

/**
 * Finds the secondary emails in the DB.
 *
 * @returns {[object]} - Array of Mongo Objects for secondary emails / [] (empty)
 */
async function findAllSecondaryEmails() {
  return await Email.find({ isPrimary: false }).exec();
}

/**
 * Delete specified secondary email.
 *
 * @param {string} incomingEmail - string name of the secondary email to delete
 * @returns {object/boolean} - true on deletion / false
 */
async function deleteSecondaryEmail(incomingEmail) {
  const email = await Email.findOne({
    email: incomingEmail,
    isPrimary: false,
  }).exec();
  // if there is no email found return false
  if (!email) {
    return false;
  }
  await Email.deleteOne({ email: incomingEmail }).exec();
  return true;
}

/**
 * Query all emails (primary and secondary) in the collection.
 *
 * @returns {[object]} - Returns an array of all emails in collection, where emails are JSON objects.
 */
async function findAllEmails() {
  return await Email.find({}).exec();
}

module.exports = {
  findPrimaryEmail,
  findAllSecondaryEmails,
  deleteSecondaryEmail,
  changePrimaryEmail,
  addSecondaryEmail,
  findAllEmails,
};
