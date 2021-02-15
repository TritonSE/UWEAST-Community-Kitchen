const express = require("express");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const router = express.Router();
const {
  findPrimaryEmail,
  findAllSecondaryEmails,
  deleteSecondaryEmail,
  changePrimaryEmail,
  addSecondaryEmail,
} = require("../db/services/email");

// @body: email, returns success:true if email is changed
router.post(
  "/changePrimary",
  [body("email").notEmpty().isEmail(), isValidated],
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

// @body: email, returns success:true if email is changed
router.post(
  "/addSecondary",
  [body("email").notEmpty().isEmail(), isValidated],
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

// @body: email, returns success:true if the email is deleted
router.delete(
  "/removeSecondary",
  [body("email").notEmpty().isEmail(), isValidated],
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

// returns an array of all the secondary emails in the DB
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

// returns the primary email in the DB
router.get("/primary", async (req, res, next) => {
  try {
    // returns emails or error if there is an error
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
