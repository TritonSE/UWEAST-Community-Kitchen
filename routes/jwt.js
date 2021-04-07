/**
 * File containing routes related to JWT assiged on site. Specifically, allows for the
 * verification of a JWT based on token signature.
 *
 * @summary   Contains all routes related to JWTs.
 * @author    Amrit Kaur Singh
 */

const express = require("express");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const { verify } = require("./services/jwt");

const router = express.Router();

/**
 * Given a JWT in the request body, verifies if the given JWT has been authorized by the site.
 *
 * @body {string} jwtToken - JWT to be verified for authorization
 * @returns {Response} - 200 status code if authorized
 *                       401 status code if unauthorized/missing info
 *                       500 status code if system error
 */
router.post(
  "/verify",
  [body("jwtToken").notEmpty().isString(), isValidated],
  async (req, res, next) => {
    const { jwtToken } = req.body;
    try {
      await verify(jwtToken)
        .then(() => {
          // resolved promise => authorized token
          res.sendStatus(200);
        })
        .catch((err) => {
          // rejected promise => unauthorized token
          res.sendStatus(401);
        });
    } catch (err) {
      console.error(err.message);
      res.sendStatus(500);
    }
  }
);

module.exports = router;
