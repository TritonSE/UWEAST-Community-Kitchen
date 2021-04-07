/**
 * File sets up the User mongoose schema. The User schema
 * utilizes bcrypt and sets up schema methods to compare
 * passwords and properly hash them.
 *
 * @summary   Creation of the User DB.
 */
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

userSchema.pre("save", function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

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

// implement password comparison function here
userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
