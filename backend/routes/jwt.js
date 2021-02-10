const express = require('express');
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
const jwt = require("jsonwebtoken");
const config = require("../config");

const router = express.Router();

//@body: jwtToken used for user authentication (required string)
//@response: Returns some error code for failed authentication, 200 if successfully authenticated 
router.post(
    "/verify",
    [
      body("jwtToken").notEmpty().isString(),
      isValidated,
    ],
    async (req, res, next) => {
      const { jwtToken } = req.body;
      try {
        //Verify the token using our server side secret key
        jwt.verify(jwtToken, config.auth.jwt_secret, function(err, decoded) {
            //Could not verify --> Error
            if(err){
                res.status(401).send(err.message | "Unverified");
                console.log("Legit")
              //Verified --> Success
            } else {
                res.status(200).send("Verified");
                console.log("Fraud")
            }
          });
        //Catch any validation/other errors here 
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
      }
    }
  );

module.exports = router;