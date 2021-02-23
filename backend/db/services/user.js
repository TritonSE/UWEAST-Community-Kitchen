/**
 * This file allows for interaction with the User DB.
 * Contains methods that add and update a user as well
 * as find a user.
 *
 * @summary   Creation of interaction with User DB.
 * @author    Thomas Garry
 */
const { User } = require("../models/user");

/**
 * Saves user to the DB.
 *
 * @param {object} raw_user - user object to be added
 * @returns {object/boolean} - order object / false on error
 */
async function addNewUser(raw_user) {
  try {
    user = new User(raw_user);
    await user.save();
    return user;
  } catch (err) {
    return false;
  }
}

/**
 * Finds user in the DB.
 *
 * @param {string} incomingEmail - user email to be found
 * @returns {object/boolean} - order object / null
 */
async function findOneUser(incomingEmail) {
  return User.findOne({ email: incomingEmail }).exec();
}

/**
 * Updates user in the DB.
 *
 * @param {object} updated_user - updated user object
 * @returns {object/boolean} - updated object
 */
async function updateOneUser(updated_user) {
  return updated_user.save();
}

module.exports = {
  addNewUser,
  findOneUser,
  updateOneUser,
};
