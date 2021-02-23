/**
 * This file is middleware for express-validator to throw errors.
 *
 * @summary   Validation middleware for express-validator
 * @author    TSE
 */
const { validationResult } = require("express-validator");

const isValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  } else {
    return res.status(400).json({ message: "User input is malformed" });
  }
};

module.exports = {
  isValidated,
};
