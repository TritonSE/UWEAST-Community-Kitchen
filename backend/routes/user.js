/**
 * This file creates the routes to allow for interaction with the user DB.
 * Contains routes to add, update or find a user.
 * Also contains configuration and jwt to allow for login functionality as well as
 * email functionality.
 *
 * @summary   Login, registration, reset password, and forgot password functionality for accounts.
 * @author    Amrit Kaur Singh, Thomas Garry
 */

const express = require("express");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const {
  addNewUser,
  findOneUser,
  updateOneUser,
} = require("../db/services/user");
const { sendEmail } = require("../routes/services/mailer");
const { createJWT } = require("./services/jwt");
const router = express.Router();
const config = require("../config");
const crypto = require("crypto");

const config = require('../config');
const FRONTEND_URI = config.frontend.uri;

// used for random password generation (Route: /forgotPassword)
const MIN_PASS_LENGTH = 6;
const MAX_PASS_LENGTH = 15;

/**
 * Registers a user into the DB.
 *
 * @body email, password, secret - Use middleware to validate
 * @returns {status/object} - 200 json with email and jwt / 500 with err
 */
router.post(
  "/register",
  [
    body("email").notEmpty().isEmail(),
    body("password").notEmpty().isString().isLength({ min: 6 }),
    body("secret").notEmpty().isString(),
    isValidated,
  ],
  async (req, res, next) => {
    const { email, password, secret } = req.body;
    try {
      user = {
        email,
        password,
        secret,
      };
      // validate secrets
      if (secret !== config.auth.register_secret) {
        return res.status(401).json({ errors: [{ msg: "User Error" }] });
      }
      // try to create user
      const addSuccesful = await addNewUser(user);
      if (!addSuccesful) {
        return res.status(409).json({ errors: [{ msg: "Duplicate User" }] });
      } else {
        // created user, return email and token
        const payload = {
          email: email,
        };
        res.status(200).json({
          email: email,
          token: createJWT(payload),
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * Logins a user.
 *
 * @body email, password - Use middleware to validate
 * @returns {status/object} - 200 json with email and jwt / 500 with err
 */
router.post(
  "/login",
  [
    body("email").notEmpty().isEmail(),
    body("password").notEmpty().isString().isLength({ min: 6 }),
    isValidated,
  ],
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      // check if user exists
      const user = await findOneUser(email);
      if (!user) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      // compare user password with passed in value
      user.comparePassword(password, function (err, isMatch) {
        if (err) throw err;
        if (!isMatch) {
          return res
            .status(401)
            .json({ errors: [{ msg: "Invalid Credentials" }] });
        }
        // matched user, return email and token
        const payload = {
          email: email,
        };
        res.status(200).json({
          email: email,
          token: createJWT(payload),
        });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

/**
 * Returns a random number between min (inclusive) and max (exclusive).
 * Used in /forgotPassword route to help create randomly generated password.
 *
 * @param {Number} min - Minimum value
 * @param {Number} max - Maximum value
 * @returns {Number} - A random number between min and max
 */
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Sends Email containing new password for forgot password if the user is authenticated with email.
 *
 * @body {string} - Email that denotes an existing user's email in the DB
 * @returns {status/object} - 200 if password is reset to a rendomly generated password / 400 or 500 with err
 */
router.post(
  "/forgotPassword",
  [body("email").notEmpty().isEmail(), isValidated],
  async (req, res, next) => {
    const { email } = req.body;
    try {
      // check if user email exists
      const user = await findOneUser(email);
      if (!user) {
        return res.status(401).json({
          errors: [{ msg: "Email Not Associated With User Account" }],
        });
      }

      // generate a random password
      const passLength = getRandomArbitrary(MIN_PASS_LENGTH, MAX_PASS_LENGTH);
      const randomlyGeneratedPass = crypto
        .randomBytes(passLength)
        .toString("hex");

      // set user's password to the randomly generated one
      user.password = randomlyGeneratedPass;

      // attempt to update the password for the user
      const updatedUser = await updateOneUser(user);
      if (!updatedUser) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Could not update user..." }] });
      }

      // send an automated email to the user containing their new randomly generated password
      const locals = {
        password: randomlyGeneratedPass,
        resetLink: `${FRONTEND_URI}reset-password`,
      };

      sendEmail("forgot-password", email, locals, res);

      res.status(200).json({
        msg: "Email Successfully Sent",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

/**
 * Resets password for authenticated users.
 *
 * @body {string} email - Denotes an existing user's email in the DB
 * @body {string} oldPassword - Denotes an existing user's current password in DB - required
 * @body {string} newPassword - Denotes what an existing user's password will be changed to - required
 * @returns {status/object} - 200 if email and oldPassword match and the password is updated / 401 or 500 with err
 */
router.post(
  "/resetPassword",
  [
    body("email").notEmpty().isEmail(),
    body("oldPassword").notEmpty().isString(),
    body("newPassword").notEmpty().isString().isLength({ min: 6 }),
    isValidated,
  ],
  async (req, res, next) => {
    const { email, oldPassword, newPassword } = req.body;
    try {
      // check if user email exists
      const user = await findOneUser(email);
      // error: User email does not exist
      if (!user) {
        return res.status(401).json({
          errors: [{ msg: "Email Not Associated With User Account" }],
        });
      }

      // check if the old password matches the email (authenticated user)
      user.comparePassword(oldPassword, function (err, isMatch) {
        if (err) throw err;
        // error: Old Password does not match!
        if (!isMatch) {
          return res
            .status(401)
            .json({ errors: [{ msg: "Invalid Credentials" }] });
        }
      });

      // attempt to update to the newPassword for the user
      user.password = newPassword;

      const updatedUser = await updateOneUser(user);
      // error: Password could not be updated
      if (!updatedUser) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Password Could Not Be Updated!" }] });
      }

      // success!
      res.status(200).json({
        msg: "Password Successfully Updated!",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
