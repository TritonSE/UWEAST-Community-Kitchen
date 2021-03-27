/**
 * This file is middleware for express-validator to throw errors.
 *
 * @summary   Validation middleware for express-validator.
 * @author    TSE
 */
const { validationResult } = require("express-validator");

const isValidated = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  } else {
    // send 401 status if a reason for validation failure was an expired/fraud JWT admin token
    for (var i = 0; i < result.errors.length; i++) {
      if (result.errors[i].param === "token") {
        return res
          .status(401)
          .json({
            message:
              "Cannot process request for unauthenticated user - login first",
          });
      }
    }
    return res.status(400).json({ message: "User input is malformed" });
  }
};

module.exports = {
  isValidated,
};
