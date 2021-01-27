const { User } = require("../models/user");

// if user doesn't exist create and return user otherwise false
async function addNewUser(raw_user) {
  try {
    user = new User(raw_user);
    await user.save();
    return user;
  } catch (err) {
    return false;
  }
}

async function findOneUser(incomingEmail) {
  return User.findOne({ email: incomingEmail }).exec();
}

async function updateOneUser(updated_user){
  return updated_user.save();
}

module.exports = {
  addNewUser,
  findOneUser,
  updateOneUser
};
