import React from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { 
  TextField, Button, Grid, 
  Snackbar, Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isAuthenticated, setJWT, setUser } from '../util/auth';
import Navbar from '../components/NavBar';
import ForgotPasswordDialogue from '../components/ForgotPasswordDialogue';

const config = require('../config');

const BACKEND_URL = config.backend.uri;

const useStyles = makeStyles((theme) => ({
  centered: {
    textAlign: 'center'
  },
  form: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%'
    },
    '& .MuiTypography-root': {
      margin: theme.spacing(1),
      width: '100%'
    },
    '& .MuiButton-root': {
      margin: theme.spacing(3),
    }
  },
  title: {
    margin: theme.spacing(2),
    textAlign: 'center'
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
    snack: {
      message: '',
      open: false
    },
    form_disabled: false,
  });

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({ ...state, form_disabled: true });
    const submission = {
      email: state.email,
      oldPassword: state.oldPassword,
      newPassword: state.newPassword
    };

    //Check if either field is empty
    if (state.email === '' || state.oldPassword === '' || state.newPassword ==='' || state.confirmNewPassword ===''){
        setState({...state, form_disabled: false, snack: {message: 'Please fill out all required fields.', open: true}});
        return;
    }
    //Check Password Length
    if (state.newPassword.length < 6) {
      setState({...state, form_disabled: false, snack: {message: 'New Password must be at least 6 characters long.', open: true}});
      return;
    }

    //Check New Password Matches Confirmed Password
    if (state.newPassword !== state.confirmNewPassword) {
      setState({...state, form_disabled: false, snack: {message: 'New Password Does Not Match', open: true}});
      return;
    }

    //Check New Password is different from Old Password
    if (state.newPassword === state.oldPassword) {
      setState({...state, form_disabled: false, snack: {message: 'New Password Cannot Be The Same As Current Password!', open: true}});
      return;
    }

    try {
        //Attempt to login with given credentials 
      const response = await fetch(`${BACKEND_URL}user/resetPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      //Successful Login
      if (response.ok) {
        alert("Password Successfully Reset!");
        history.push("/reset-password");
        history.go(0);
      }
      //Invalid Credentials
      else if (response.status === 401) {
        setState({...state, form_disabled: false, snack: {message: 'Email or old password not recognized.', open: true}});
      }
      //Any other server response
      else {
        setState({...state, form_disabled: false, snack: {message: `An error occurred: Password could not be updated`, open: true}});
      }
    } 
    //General Error
    catch (error) {
      setState({...state, form_disabled: false, snack: {message: `An error occurred: ${error.message}`, open: true}});
    }
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState({...state, snack: {...state.snack, open: false}});
  };

  //If user is already logged in, then redirect to Admin Page
  return isAuthenticated() ? <Redirect to="/admin"/> : ( 
      <div>
          <Navbar/>
           <Grid
                container
                spacing={0}
                alignItems="center"
                justify="center"
                >
                <Grid item md={6} xs={12}>
                    <Typography variant="h4" className={classes.title}>
                    Reset Password
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField label='Email' variant='outlined' type='email' onChange={handleChange('email')}/>
                    <TextField  label='Current Password' variant='outlined' type='password' onChange={handleChange('oldPassword')}/>
                    <TextField  label='New Password' variant='outlined' type='password' onChange={handleChange('newPassword')}/>
                    <TextField label='Confirm New Password' variant='outlined' type='password' onChange={handleChange('confirmNewPassword')}/>
                     <ForgotPasswordDialogue/>
                    <div className={classes.centered}>
                        <Button variant="contained" color="primary" type="submit" disabled={state.form_disabled}>Reset</Button>
                    </div>
                    </form>
                </Grid>   
                <Snackbar open={state.snack.open} autoHideDuration={6000} onClose={handleSnackClose} message={state.snack.message}/>
            </Grid> 
      </div>
   
  )
}