/**
 * This file holds all service related functions for JWT used on the site. Specifically, it
 * allows for the creation and verification of JWTs using pre-defined constants for
 * reproducible signature authentications. 
 * 
 * @summary   Creation and verification of JWTs via functions.
 * @author    Amrit Kaur Singh, Thomas Garry
 */

const jwt = require("jsonwebtoken");
const config = require("../../config");

//  denotes length of time a JWT will be considered valid after creation
const JWT_EXPIRY = "1h";

/**
 * Given a payload, synchronously creates a JWT with a specific signature and expiry date.
 * 
 * @param {string} payload - Data stored within the JWT
 * @returns {string} - JWT
 */
function createJWT(payload){
  return jwt.sign(payload, config.auth.jwt_secret, {
    expiresIn: JWT_EXPIRY,
  });
}

/**
 * Given a JWT, verifies if the JWT was indeed authorized by this site. 
 * 
 * @param {string} token - JWT to verify
 * @returns {Promise} - Resolved promise if authorized, rejected promise otherwise
 */
async function verify(token) {
  return await jwt.verify(token, config.auth.jwt_secret, (err, decoded) => {
    // invalid token
    if (err) {
      return Promise.reject();
    }
    return Promise.resolve();
  });
}

module.exports = {
  verify,
  createJWT
};
