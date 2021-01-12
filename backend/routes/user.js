const express = require("express");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const { addNewUser, findOneUser } = require("../db/services/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../config");

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
        return res.status(400).json({ errors: [{ msg: "User error" }] });
      }
      // try to create user
      const addSuccesful = await addNewUser(user);
      if (!addSuccesful) {
        return res.status(400).json({ errors: [{ msg: "duplicate user" }] });
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
      res.status(500).send("Server err");
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
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      // compare user password with passed in value
      user.comparePassword(password, function (err, isMatch) {
        if (err) throw err;
        if (!isMatch) {
          return res
            .status(400)
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
      res.status(500).send("Server err");
    }
  }
);

module.exports = router;
