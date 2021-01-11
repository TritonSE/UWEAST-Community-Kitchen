const { User } = require("../models/user");

// if user doesn't exist create and return user otherwise false
async function addNewUser(raw_user) {
  let user = await User.findOne({ email: raw_user.email }).exec();
  if (user) {
    return false;
  } else {
    user = new User(raw_user);
    await user.save();
    return user;
  }
}

async function findOneUser(incomingEmail) {
  return User.findOne({ email: incomingEmail }).exec();
}

module.exports = {
  addNewUser,
  findOneUser,
};
