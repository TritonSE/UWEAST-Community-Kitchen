/**
 * This file allows for interaction with the User DB.
 * Contains methods that add and update a user as well
 * as find a user.
 */
const { User } = require("../models/user");

// @description - create a user
// @param {object} raw_user - user object to add
// @return - user object / false on error
async function addNewUser(raw_user) {
  try {
    user = new User(raw_user);
    await user.save();
    return user;
  } catch (err) {
    return false;
  }
}

// @description - find a user
// @param {object} raw_user - user object to add
// @return - user object / false on error
async function findOneUser(incomingEmail) {
  return User.findOne({ email: incomingEmail }).exec();
}

// @description - update a user
// @param {object} updated_user - user object to edit
// @return - user object / false on error
async function updateOneUser(updated_user) {
  return updated_user.save();
}

module.exports = {
  addNewUser,
  findOneUser,
  updateOneUser,
};
