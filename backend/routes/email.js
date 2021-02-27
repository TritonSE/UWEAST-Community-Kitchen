/**
 * This file creates the routes to allow for interaction with the Email DB.
 * Contains routes to add or change the primary email, add a secondary email, and remove a secondary email.
 * Also contains get requests to get the primary email and secondary email(s) as well as
 * delete request to delete a secondary email.
 *
 * @summary   Routes to modify the Email DB specifically changing, finding and deleting emails.
 * @author    Thomas Garry
 */
const express = require("express");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const { verify } = require("./services/jwt");
const router = express.Router();
const {
  findPrimaryEmail,
  findAllSecondaryEmails,
  deleteSecondaryEmail,
  changePrimaryEmail,
  addSecondaryEmail,
} = require("../db/services/email");

/**
 * Changes the primary email address in the Email DB.
 *
 * @body {string} - email to be set to the Primary address
 * @body {string} token - Admin token to verify for authorization
 * @returns {status/object} - 200 with success if email is changed /
 *                            400 if duplicate email or failure
 */
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

/**
 * Adds the secondary email address in the Email DB.
 *
 * @body {object} - email to be set as a secondary address
 * @body {string} token - Admin token to verify for authorization
 * @returns {status/object} - 200 with success if email is changed /
 *                            400 if duplicate email or failure
 */
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

/**
 * Deletes the secondary email address in the Email DB.
 *
 * @body {object} - email to be deleted from the secondary addresses
 * @body {string} token - Admin token to verify for authorization
 * @returns {status/object} - 200 with success if email is changed /
 *                            400 if duplicate email or failure
 */
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

/**
 * Gets all the secondary emails.
 *
 * @returns {status/[object]} - 200 with an array of all the secondary emails in the DB / 500 err
 */
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

/**
 * Gets the primary email in the DB.
 *
 * @returns {status/object}} - 200 with the primary email in the DB / 500 err
 */
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
