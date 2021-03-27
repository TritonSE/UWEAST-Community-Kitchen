/**
 * The file is responsible for the display and functionality of the reset password functionality, allowing
 * users who have admin accounts to reset their account password if needed. It assumes that the user 
 * already has a registered account on the site, and knows their current account password,. If the user does not, the user must 
 * first access the "forgot password" link at the bottom of the page. 
 * 
 * If the password reset is successful, an alert is given to indicate success. Otherwise, an error message
 * is shown. 
 * 
 * Once password has been successfully reset, any subsequent logins on the account must be done with the 
 * newly reset password, due to updates made on the backend. 
 * 
 * Note: Unlike login and registeration, this page is accessible to all users regardless of whether they are 
 * logged in or not. If password is reset while the user is logged in, the change will be effective on the
 * next login. 
 * 
 * @summary     Displays reset password page and allows user to update thier account password. 
 * @author      Amrit Kaur Singh
 */

import React from 'react';
import { useHistory } from 'react-router-dom';
import { 
  TextField, Button, Grid, 
  Snackbar, Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../components/NavBar';
import ForgotPasswordDialogue from '../components/ForgotPasswordDialogue';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import DOMPurify from 'dompurify';

import "../css/AccountsPages.css";

const config = require('../config');

const BACKEND_URL = config.backend.uri;

const useStyles = makeStyles((theme) => ({

  centered: {
    textAlign: 'center'
  },
  form: {
    // input field - general layout
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '95%'
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "black"
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "black"
    },
    '& .MuiTypography-root': {
      margin: theme.spacing(1),
      width: '100%'
    },

    '& .MuiButton-root': {
      margin: theme.spacing(3),
      color: 'black',
      background: '#F9CE1D',
      width:'30%'
    }
  },
  title: {
    margin: theme.spacing(2),
    textAlign: 'center',
    fontWeight: 'bolder',
    textTransform: 'uppercase'
  }
}));

export default function ResetPassword() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    showPassword: {
      oldPassword: false,
      newPassword: false,
      confirmNewPassword: false
    },
    snack: {
      message: '',
      open: false
    },
    errors: {
      email: false,
      oldPassword: false,
      newPassword: false,
      confirmNewPassword: false
    },
    form_disabled: false,
  });

  // updates given state with given value 
  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleClickShowOldPassword = () => {
    setState({ ...state, showPassword: {...state.showPassword, oldPassword: !state.showPassword.oldPassword } });
  };

  const handleClickShowNewPassword = () => {
    setState({ ...state, showPassword: { ...state.showPassword, newPassword: !state.showPassword.newPassword } });
  };

  const handleClickShowNewPasswordConfirmation = () => {
    setState({ ...state, showPassword: {...state.showPassword, confirmNewPassword: !state.showPassword.confirmNewPassword } });
  };


  /**
   * Handles submission of the form (button click). Validates form data for completion/length, making a backend request to Users DB for email + password match. If 
   * it succeeds, user's password is updated in Users DB. Otherwise, an error message appears.
   * 
   * @param {*} event - Reason for function call 
   * @returns {void} 
   */ 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({ ...state, form_disabled: true });

    // display loading cursor 
    document.body.style.cursor= 'wait';

    // sanitize input - XSS attack protection 
    state.email =  DOMPurify.sanitize(state.email);
    state.oldPassword =  DOMPurify.sanitize(state.oldPassword);
    state.newPassword =  DOMPurify.sanitize(state.newPassword);
    state.confirmNewPassword =  DOMPurify.sanitize(state.confirmNewPassword);

    const submission = {
      email: state.email,
      oldPassword: state.oldPassword,
      newPassword: state.newPassword
    };

    let email = false;
    let oldPassword = false; 
    let newPassword = false;
    let confirmNewPassword = false; 

    // check if either field is empty
    if (state.email === ''){
        email = true;
    }
    if (state.oldPassword === ''){
        oldPassword = true;
    }
    if (state.newPassword === ''){
      newPassword = true;
    }
    if (state.confirmNewPassword === ''){
      confirmNewPassword = true;
    }
    if(email + oldPassword + newPassword + confirmNewPassword > 0){
        document.body.style.cursor= null;
        setState({...state, errors: {email: email, oldPassword: oldPassword, newPassword: newPassword, confirmNewPassword: confirmNewPassword}, form_disabled: false, snack: {message: 'Please fill out all required fields.', open: true}});
        return;
    }

    // check password length
    if (state.newPassword.length < 6) {
      document.body.style.cursor= null;
      setState({...state, errors: {email: false, oldPassword: false, newPassword: true, confirmNewPassword: false}, form_disabled: false, snack: {message: 'New Password must be at least 6 characters long.', open: true}});
      return;
    }

    // check passwords match
    if (state.newPassword !== state.confirmNewPassword) {
      document.body.style.cursor= null;
      setState({...state, errors: {email: false, oldPassword: false, newPassword: true, confirmNewPassword: true}, form_disabled: false, snack: {message: 'New Password Does Not Match', open: true}});
      return;
    }

    // check new password is different from old password
    if (state.newPassword === state.oldPassword) {
      document.body.style.cursor= null;
      setState({...state, errors: {email: false, oldPassword: true, newPassword: true, confirmNewPassword: true}, form_disabled: false, snack: {message: 'New Password Cannot Be The Same As Current Password!', open: true}});
      return;
    }

    try {
      // attempt to register with given credentials 
      const response = await fetch(`${BACKEND_URL}user/resetPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      // successful reset
      if (response.ok) {
        alert("Password Successfully Reset!");
        history.push("/login");
        history.go(0);
      }
      // invalid credentials
      else if (response.status === 401) {
        document.body.style.cursor= null;
        setState({...state, errors: {email: true, oldPassword: true, newPassword: false, confirmNewPassword: false}, form_disabled: false, snack: {message: 'Invalid Authentication: Email or old password not recognized.', open: true}});
      }
      // any other server response
      else {
        document.body.style.cursor= null;
        setState({...state, errors: {email: false, oldPassword: false, newPassword: false, confirmNewPassword: false}, form_disabled: false, snack: {message: `An error occurred: Password could not be updated`, open: true}});
      }
    } 
    // general error
    catch (error) {
      document.body.style.cursor= null;
      setState({...state, errors: {email: false, oldPassword: false, newPassword: false, confirmNewPassword: false}, form_disabled: false, snack: {message: `An error occurred: ${error.message}`, open: true}});
    }
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState({...state, snack: {...state.snack, open: false}});
  };

  return ( 
      <html className="Account-Html">
        <body className="Account-Body">
          {/* navbar */}
          <div className="NavBar">
            <Navbar/>
          </div>
           <Grid
                container
                spacing={0}
                alignItems="center"
                justify="center"
                className="Account-Box"
                >
                <Grid 
                item md={6} xs={12}
                >
               <div className="Border">
                      {/* title + description  */}
                      <Typography variant="h4" className={classes.title}>
                      Reset Password
                      </Typography>
                      <p className={classes.centered} style={{color: "#8d8d8d"}}> Fill out the fields below to reset the password of an existing account </p>
                      {/* form  */}
                      <form className={classes.form} onSubmit={handleSubmit}>
                        {/* email field  */}
                        <TextField label='Email' variant='outlined' type='email' onChange={handleChange('email')} error={state.errors.email}/>
                        {/* current password field  */}
                        <TextField  
                        label='Current Password' 
                        variant='outlined' 
                        type={state.showPassword.oldPassword ? 'text' : 'password'} 
                        onChange={handleChange('oldPassword')} 
                        error={state.errors.oldPassword}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowOldPassword}
                              >
                                {state.showPassword.oldPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }
                        />
                        {/* new password field  */}
                        <TextField  
                        label='New Password' 
                        variant='outlined' 
                        type={state.showPassword.newPassword ? 'text' : 'password'} 
                        onChange={handleChange('newPassword')} 
                        error={state.errors.newPassword}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowNewPassword}
                              >
                                {state.showPassword.newPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }
                        />
                        {/* confirm new password field  */}
                        <TextField 
                        label='Confirm New Password' 
                        variant='outlined' 
                        type={state.showPassword.confirmNewPassword ? 'text' : 'password'} 
                        onChange={handleChange('confirmNewPassword')} 
                        error={state.errors.confirmNewPassword}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowNewPasswordConfirmation}
                              >
                                {state.showPassword.confirmNewPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }
                        />
                        {/* forgot password dialogue  */}
                        <ForgotPasswordDialogue/>
                        {/* reset button  */}
                        <div className={classes.centered}>
                            <Button variant="contained" color="primary" type="submit" disabled={state.form_disabled}>Reset</Button>
                        </div>
                      </form>
                      </div>
                </Grid> 
                {/* error messages displayed at bottom of screen */}  
                <Snackbar open={state.snack.open} autoHideDuration={6000} onClose={handleSnackClose} message={state.snack.message}/>
            </Grid> 
            </body>
      </html>
  )
}