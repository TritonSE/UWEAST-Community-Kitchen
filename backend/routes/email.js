/**
 * This file creates the routes to allow for interaction with the Email DB.
 * Contains routes to add or change the primary email, add a secondary email, and remove a secondary email.
 * Also contains get requests to get the primary email and secondary email(s) as well as
 * delete request to delete a secondary email.
 */
const express = require("express");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const { verify } = require("./verifyToken");
const router = express.Router();
const {
  findPrimaryEmail,
  findAllSecondaryEmails,
  deleteSecondaryEmail,
  changePrimaryEmail,
  addSecondaryEmail,
} = require("../db/services/email");

// @description - changes the primary email address in the Email DB
// @body - email
// @return - { success:true } if email is changed
//          "Email change unsuccessful": if duplicate email or failures
router.post(
  "/changePrimary",
  [
    body("email").notEmpty().isEmail(),
    body("token").custom(async (token) => {
      // verify token
      return await verify(token);
    }),
    isValidated,
  ],
  async (req, res, next) => {
    const { email } = req.body;
    try {
      // try to change email and respond with err msg or success
      emailJson = {
        email: email,
        isPrimary: true,
      };
      const emailSuccessful = await changePrimaryEmail(emailJson);
      if (!emailSuccessful) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email change unsuccessful" }] });
      } else {
        return res.status(200).json({ success: true });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server err");
    }
  }
);

// @description: adds the secondary email address in the Email DB
// @body - email
// @return - { success:true } if secondary email is added
//          "Email change unsuccessful": if duplicate email or failures
router.post(
  "/addSecondary",
  [
    body("email").notEmpty().isEmail(),
    body("token").custom(async (token) => {
      // verify token
      return await verify(token);
    }),
    isValidated,
  ],
  async (req, res, next) => {
    const { email } = req.body;
    try {
      // try to change email and respond with err msg or success
      emailJson = {
        email: email,
        isPrimary: false,
      };
      const emailSuccessful = await addSecondaryEmail(emailJson);
      if (!emailSuccessful) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email change unsuccessful" }] });
      } else {
        return res.status(200).json({ success: true });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server err");
    }
  }
);

// @description - deletes the secondary email address in the Email DB
// @body - email
// @return - { success:true } if the secondary email is deleted
//          "Enter a valid secondary email": if email is not in DB/failure
router.delete(
  "/removeSecondary",
  [
    body("email").notEmpty().isEmail(),
    body("token").custom(async (token) => {
      // verify token
      return await verify(token);
    }),
    isValidated,
  ],
  async (req, res, next) => {
    const { email } = req.body;
    try {
      // check if user exists
      const deleteSuccessful = await deleteSecondaryEmail(email);
      if (!deleteSuccessful) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Enter a valid secondary email" }] });
      } else {
        return res.status(200).json({ success: true });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server err");
    }
  }
);

// @description - gets all the secondary emails
// @body - email
// @return - returns an array of all the secondary emails in the DB
router.get("/secondary", async (req, res, next) => {
  try {
    // returns emails or error if there is an error
    const emails = await findAllSecondaryEmails();
    res.status(200).json({
      emails: emails,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server err");
  }
});

// @description - gets the primary email in the DB
// @body - email
// @return - returns the primary email in the DB
router.get("/primary", async (req, res, next) => {
  try {
    // returns email or error if there is an error
    const email = await findPrimaryEmail();
    res.status(200).json({
      email: email,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server err");
  }
});

module.exports = router;
