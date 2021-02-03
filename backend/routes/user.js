const express = require("express");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const { addNewUser, findOneUser, updateOneUser } = require("../db/services/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../config");
const crypto = require("crypto");

//Used for random password generation
const MIN_PASS_LENGTH = 6;
const MAX_PASS_LENGTH = 15;

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

const nodemailer = require("nodemailer");
const Email = require('email-templates');

//transporter object for nodemailer
const transporter = config.uweast.user === "" ? null : nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: config.uweast
});

//template based sender object
const mail = config.uweast.user === "" ? null : new Email({
  transport: transporter,
  send: true,
  preview: false
});

//Populates given email template with req.body and sends it to to_email
async function sendEmail(template, to_email , locals, res) {
  if (mail != null) {
    await mail.send({
      template: template,
      message: {
        from: config.uweast.user,
        to: to_email
      },
      locals: locals
    });
    console.log(`Email ${template} has been sent to ${to_email}.`);
  } else {
    return res.status(500).send("Server err");
  }
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

      //Generate a random password
      const passLength = getRandomArbitrary(MIN_PASS_LENGTH, MAX_PASS_LENGTH);
      const randomlyGeneratedPass = crypto.randomBytes(passLength).toString('hex');

      //Set user's password to the randomly generated one
      user.password = randomlyGeneratedPass;

      //Attempt to update the password for the user 
      const updatedUser = await updateOneUser(user);
      if(!updatedUser){
        return res
          .status(400)
          .json({ errors: [{ msg: "Could not update user..." }] });
      }

      //Send an automated email to the user containing their new randomly generated password
      const locals = {
        password: randomlyGeneratedPass,
        resetLink: 'http://localhost:3000/reset-password'
      }

      sendEmail('forgot-password', email, locals, res);

      res.status(200).json({
        msg: "Email Successfully Sent"
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.post(
  "/resetPassword",
  [
    body("email").notEmpty().isEmail(),
    body("oldPassword").notEmpty().isString(),
    body("newPassword").notEmpty().isString().isLength({ min: 6 }),
    isValidated,
  ],
  async (req, res, next) => {
    console.log(req.body);
    const { email, oldPassword, newPassword } = req.body;
    try {
      // check if user email exists
      const user = await findOneUser(email);
      //Error: User email does not exist
      if (!user) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Email Not Associated With User Account" }] });
      }

       // check if the old password matches the email (authenticated user)
       user.comparePassword(oldPassword, function (err, isMatch) {
        if (err) throw err;
        //Error: Old Password does not match!
        if (!isMatch) {
          return res
            .status(401)
            .json({ errors: [{ msg: "Invalid Credentials" }] });
        }
      });

      //Attempt to update to the newPassword for the user
      user.password = newPassword;

      const updatedUser = await updateOneUser(user);
      //Error: Password could not be updated
      if(!updatedUser){
        return res
          .status(400)
          .json({ errors: [{ msg: "Password Could Not Be Updated!" }] });
      }

      //Success!
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
