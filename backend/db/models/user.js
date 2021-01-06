const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const SALT_WORK_FACTOR = 10;


const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String }
  // firstname: String,
  // lastname: String,
});

userSchema.pre('save', function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (errH, hash) => {
      if (errH) return next(errH);

      // overrirde the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

//implement password comparison function here

const User = mongoose.model('User', userSchema);

module.exports = { User };