const config = require('../config');

const ADMIN_TOKEN_ATTRIBUTE = 'uweast-ck:admin-token'; //Genereated from backend using secret-id

const BACKEND_URL = config.backend.uri;

//Returns true if user is logged in, false otherwise
async function isAuthenticated() {
    if (!localStorage.hasOwnProperty(ADMIN_TOKEN_ATTRIBUTE)){
        return false
    }
    const submission = {
        jwtToken: localStorage.getItem(ADMIN_TOKEN_ATTRIBUTE)
    }

    try{
      const response = await 
        fetch(`${BACKEND_URL}jwt/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission)
        });
        if(response.ok){
          return true;
        }
        return false;
      } catch(err){
        return false;
    }
  }
  
  //Retrieves the logged in user's JWT token from local storage
function getJWT() {
    if (!localStorage.hasOwnProperty(ADMIN_TOKEN_ATTRIBUTE)) {
      return null;
    }
    return localStorage.getItem(ADMIN_TOKEN_ATTRIBUTE);
  }
  
  //Sets the user's JWT token in local storage
  function setJWT(token) {
    localStorage.setItem(ADMIN_TOKEN_ATTRIBUTE, token);
  }
  
  //Clears out all attributes in local storage
  function logout() {
    localStorage.removeItem(ADMIN_TOKEN_ATTRIBUTE);
  }
  
  export {
    isAuthenticated, getJWT, setJWT, logout
  };
