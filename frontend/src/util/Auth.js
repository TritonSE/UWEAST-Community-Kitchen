/**
 * File contains all functions related to setting, removing, and accessing the admin token on the site
 * using LocalStorage.
 * 
 * @summary   Functionality related to admin tokens. 
 * @author    Amrit Kaur Singh
 */

const config = require('../config');

const ADMIN_TOKEN_ATTRIBUTE = 'uweast-ck:admin-token'; // genereated from backend using secret-id

const BACKEND_URL = config.backend.uri;

// returns true if user is logged in, false otherwise
async function isAuthenticated() {
  try {
    if (!localStorage.hasOwnProperty(ADMIN_TOKEN_ATTRIBUTE)) {
      return false
    }
    const submission = {
      jwtToken: localStorage.getItem(ADMIN_TOKEN_ATTRIBUTE)
    }

    try {
      const response = await
        fetch(`${BACKEND_URL}jwt/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission)
        });
      if (response.ok) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  } catch (err) {
    return false;
  }
}

// retrieves the logged in user's JWT token from local storage
function getJWT() {
  try {
    if (!localStorage.hasOwnProperty(ADMIN_TOKEN_ATTRIBUTE)) {
      return null;
    }
    return localStorage.getItem(ADMIN_TOKEN_ATTRIBUTE);
  } catch (err) {
    return false;
  }
}

// sets the user's JWT token in local storage
function setJWT(token) {
  try {
    localStorage.setItem(ADMIN_TOKEN_ATTRIBUTE, token);
  } catch (err) {
    return false;
  }
}

//Clears out all attributes in local storage
function logout() {
  try {
    if (localStorage.hasOwnProperty(ADMIN_TOKEN_ATTRIBUTE)) {
      localStorage.removeItem(ADMIN_TOKEN_ATTRIBUTE);
    }
  } catch (err) {
    return false;
  }
}

export {
  isAuthenticated, getJWT, setJWT, logout
};
