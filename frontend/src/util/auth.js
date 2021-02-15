const config = require('../config');

const ADMIN_TOKEN_ATTRIBUTE = 'uweast-ck:admin-token'; //Genereated from backend using secret-id
const ADMIN_EMAIL_ATTRIBUTE = 'uweast-ck:admin-email';

const BACKEND_URL = config.backend.uri;

//Returns true if user is logged in, false otherwise
async function isAuthenticated() {
    if (!localStorage.hasOwnProperty(ADMIN_TOKEN_ATTRIBUTE)){
        return false
    }
    const submission = {
        jwtToken: localStorage.getItem(ADMIN_TOKEN_ATTRIBUTE)
    }
    const response = await fetch(`${BACKEND_URL}jwt/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      if(response.ok){
          return true;
      }
      return false;
    // return localStorage.hasOwnProperty(ADMIN_TOKEN_ATTRIBUTE);
  }
  
  //Retrieves the logged in user's JWT token from local storage
  function getJWT() {
    if (!isAuthenticated()) {
      return null;
    }
    return localStorage.getItem(ADMIN_TOKEN_ATTRIBUTE);
  }
  
  //Sets the user's JWT token in local storage
  function setJWT(token) {
    localStorage.setItem(ADMIN_TOKEN_ATTRIBUTE, token);
  }
  
  //Retrieves the logged in user's email address
  function getUser() {
    if (!isAuthenticated()) {
      return null;
    }
    return JSON.parse(localStorage.getItem(ADMIN_EMAIL_ATTRIBUTE));
  }
  
  //Sets the user's email address
  function setUser(user) {
    localStorage.setItem(ADMIN_EMAIL_ATTRIBUTE, JSON.stringify(user));
  }
  
  //Clears out all attributes in local storage
  function logout() {
    localStorage.removeItem(ADMIN_TOKEN_ATTRIBUTE);
    localStorage.removeItem(ADMIN_EMAIL_ATTRIBUTE);
  }
  
  export {
    isAuthenticated, getJWT, setJWT,
    getUser, setUser, logout
  };
