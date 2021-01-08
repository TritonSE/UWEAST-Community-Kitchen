const mongoose = require("mongoose");
const mongodb = require("mongodb");
const { User } = require("../models/user");
const config = require("../../config");
const { raw } = require("express");

//Example of how to write queries/updates: https://github.com/TritonSE/tse-recruitment-backend/blob/master/services/applications.js

// if user doesn't exist and the secrets match create user and return user
async function addNewUser(raw_user) {
  let user = await User.findOne({ email: raw_user.email }).exec();
  if (user || raw_user.secret !== config.auth.register_secret) {
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
