const express = require('express');
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const jwt = require("jsonwebtoken");
const config = require("../config");

const router = express.Router();

router.post(
    "/verify",
    [
      body("jwtToken").notEmpty().isString(),
      isValidated,
    ],
    async (req, res, next) => {
      const { jwtToken } = req.body;
      try {
        jwt.verify(jwtToken, config.auth.jwt_secret, function(err, decoded) {
            if(err){
                res.status(401).send(err.message | "Unverified");
                console.log("Legit")
            } else {
                res.status(200).send("Verified");
                console.log("Fraud")
            }
          });
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
      }
    }
  );

module.exports = router;