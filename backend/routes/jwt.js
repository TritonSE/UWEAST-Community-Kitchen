const express = require("express");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const jwt = require("jsonwebtoken");
const config = require("../config");

const router = express.Router();

// @body - jwtToken used for user authentication (required string)
// @response - returns some error code for failed authentication, 200 if successfully authenticated
router.post(
  "/verify",
  [body("jwtToken").notEmpty().isString(), isValidated],
  async (req, res, next) => {
    const { jwtToken } = req.body;
    try {
      // verify the token using our server side secret key
      jwt.verify(jwtToken, config.auth.jwt_secret, function (err, decoded) {
        // could not verify --> Error
        if (err) {
          res.sendStatus(401);
          console.log("Fraud/Expired JWT Token");
          // verified --> Success
        } else {
          res.sendStatus(200);
          console.log("Valid JWT Token");
        }
      });
      // catch any validation/other errors here
    } catch (err) {
      console.error(err.message);
      res.sendStatus(500);
    }
  }
);

module.exports = router;
