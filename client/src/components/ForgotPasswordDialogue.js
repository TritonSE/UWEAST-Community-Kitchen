/**
 * The file is responsible for the display and functionality of forgot password, allowing users 
 * who already have admin accounts but have forgotten their account passwords to reset their passwords
 * temporarily. 
 * 
 * If an email of a registered account is given, that associated account's password is reset to a randomly 
 * generated password, and an email is sent to that user containing that randomly generated password as well 
 * as next steps. An alert is also given to the user. If unsuccessful, an error message is displayed. 
 * 
 * Note: Unlike login and registeration, this page is accessible to all users regardless of whether they are 
 * logged in or not. If password is reset while the user is logged in, the change will be effective on the
 * next login. 
 * 
 * @summary     Displays forgot password dialogue and allows registed user to temporarily reset their password. 
 * @author      Amrit Kaur Singh
 */

import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {createMuiTheme, ThemeProvider } from "@material-ui/core";
import DOMPurify from 'dompurify';

const config = require('../config');
const BACKEND_URL = config.backend.uri;

export default function FormDialog() {

  const theme = createMuiTheme({
    overrides: {
      // input field label
      MuiInputLabel: { 
        root: {
          "&$focused": { 
            color: "black"
          }
        }
      }
    }
  });

  const useStyles = makeStyles({
    // input field underline
    underline: {
      // non-focus & hover
      "&&&:before": {
        borderColor: "#f9ce1d"
      },
      // focus
      "&&:after": {
        borderColor: "#f9ce1d"
      }
    }
  });

  const classes = useStyles();
  
  
  const [state, setState] = React.useState({
    open: false,
    email: '',
    error:{
      display: false,
      message: ''
    }
  });


  /**
   * Handles submission of the form (button click). Validates form data for valid email address (must be a user's email address). If valid, 
   * it autogenerates a random password and sends it as an email to the user. If invalid, an error is displayed.
   * 
   * @param {*} event - Reason for function call 
   * @returns {void} 
   */
  const handleSend = async() => {

      // display loading cursor 
      document.body.style.cursor= 'wait';

      // sanitize input - XSS attack protection 
      state.email =  DOMPurify.sanitize(state.email);

      const submission = {
          email: state.email
      };

    // check if email field is empty
    if (state.email === ''){
        document.body.style.cursor= null;
        setState({...state, error:{display: true, message: "Field cannot be empty"}})
        return;
    }
    // backend call
    try{
      const response = await fetch(`${BACKEND_URL}user/forgotPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      // password successfully reset 
      if (response.ok) {
        document.body.style.cursor= null;
        alert("Email Successfully Sent!");
        handleClose();
      } 
      // invalid email
      else if(response.status === 400){
        document.body.style.cursor= null;
        setState({...state, error:{display: true, message: "Invalid Email"}});
      }
      // any other server response
      else {
            document.body.style.cursor= null;
            setState({...state, error:{display: true, message: "System Error: Try Again Later"}});
      }
    }
    // general error
    catch(error){
        document.body.style.cursor= null;
        setState({...state, error:{display: true, message: `An error occurred: ${error.message}`}});
    }

  }

  // display pop-up
  const handleClickOpen = () => {
    setState({...state, email:'', open: true, error:{display: false}});
  };

  // close pop-up
  const handleClose = () => {
    setState({...state, open: false, error:{display: false}});
  };

  // track the email address put in the text field
  const handleEmailChange = (event) => {
    setState({...state, email: event.target.value, open: true});
  }

  return (
    <div>
      {/* link preview */}
      <Link onClick={handleClickOpen}><Typography>Forgot Password?</Typography></Link>
      {/* dialogue  */}
      <Dialog open={state.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        {/* title + description */}
        <DialogTitle id="form-dialog-title"> <b>Forgot Password?</b></DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the email address of the associated account here. An email will be sent to
            you there containing next steps. 
          </DialogContentText>
          {/* email field */}
          <ThemeProvider theme={theme}>
            <TextField
              onChange={handleEmailChange}
              error={state.error.display}
              helperText={state.error.display ? state.error.message: null}
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              InputProps={{ classes }}
              // variant="Standard"
              fullWidth
            />
          </ThemeProvider>
        </DialogContent>
        <DialogActions>
          {/* cancel dialogue button */}
          <Button onClick={handleClose} style={{color: "black"}} >
            Cancel
          </Button>
          {/* send email button */}
          <Button onClick={handleSend} style={{color: "black"}}>
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
