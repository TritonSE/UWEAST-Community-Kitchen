const express = require("express");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const { addNewUser, findOneUser, updateOneUser } = require("../db/services/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../config");
const crypto = require("crypto");

// @body: email, password, secret use middleware to validate
// @return: json with email and jwt or error
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
          token: jwt.sign(payload, config.auth.jwt_secret),
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @body: email && password use middleware to validate
// @return: json with email and jwt or error
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
          token: jwt.sign(payload, config.auth.jwt_secret),
        });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

router.post(
  "/forgotPassword",
  [
    body("email").notEmpty().isEmail(),
    isValidated,
  ],
  async (req, res, next) => {
    console.log(req.body);
    const { email } = req.body;
    try {
      // check if user email exists
      const user = await findOneUser(email);
      if (!user) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Email Not Associated With User Account" }] });
      }

      //Generate a random password (should be temporary)
      const passLength = getRandomArbitrary(6, 15);
      const randomlyGeneratedPass = crypto.randomBytes(passLength).toString('hex');

      //Update the password for the user 
      const updatedUser = await updateOneUser(email, randomlyGeneratedPass);
      if(!updatedUser){
        return res
          .status(401)
          .json({ errors: [{ msg: "Could not update user..." }] });
      }

      res.status(200).json({
        msg: "Email Successfully Sent",
        pass: randomlyGeneratedPass
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
