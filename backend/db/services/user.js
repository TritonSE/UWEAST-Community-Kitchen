const mongoose = require('mongoose');
const mongodb = require('mongodb');
const { User } = require('../models/user');

//Example of how to write queries/updates: https://github.com/TritonSE/tse-recruitment-backend/blob/master/services/applications.js

function addNewUser(user) {
    User.create(user);
}

function findOneUser(candidateUsername) {
    return User.findOne({ username: candidateUsername }).exec();
}

module.exports = { 
  addNewUser,
  findOneUser};
