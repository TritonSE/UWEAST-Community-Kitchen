/**
 * This file allows routes to be verified
 */

const jwt = require("jsonwebtoken");
const config = require("../config");

// token - string
// verifies token for POST and DELETE
async function verify(token) {
  return await jwt.verify(token, config.auth.jwt_secret, (err, decoded) => {
    // invalid token
    if (err) return Promise.reject();
    return Promise.resolve();
  });
}
module.exports = {
  verify,
};
