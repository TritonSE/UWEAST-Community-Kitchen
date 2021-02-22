import React from 'react';
import { useHistory } from 'react-router-dom';
import { 
  TextField, Button, Grid, 
  Snackbar, Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../components/NavBar';
import ForgotPasswordDialogue from '../components/ForgotPasswordDialogue';
import "../css/ResetPassword.css";

const config = require('../config');

const BACKEND_URL = config.backend.uri;

const useStyles = makeStyles((theme) => ({

  centered: {
    textAlign: 'center'
  },
  form: {
    //Input Field - General Layout
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

  // Updates given state with given value 
  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  // Handles submission of the form (button click)
  // Validates form data for completion/length, making a backend request to Users DB for email + password match. If 
  // it succeeds, user's password is updated in Users DB. Otherwise, an error message appears. 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({ ...state, form_disabled: true });
    const submission = {
      email: state.email,
      oldPassword: state.oldPassword,
      newPassword: state.newPassword
    };

    let email = false;
    let oldPassword = false; 
    let newPassword = false;
    let confirmNewPassword = false; 

    //Check if any field is empty
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
        setState({...state, errors: {email: email, oldPassword: oldPassword, newPassword: newPassword, confirmNewPassword: confirmNewPassword}, form_disabled: false, snack: {message: 'Please fill out all required fields.', open: true}});
        return;
    }

    //Check Password Length
    if (state.newPassword.length < 6) {
      setState({...state, errors: {email: false, oldPassword: false, newPassword: true, confirmNewPassword: false}, form_disabled: false, snack: {message: 'New Password must be at least 6 characters long.', open: true}});
      return;
    }

    //Check New Password Matches Confirmed Password
    if (state.newPassword !== state.confirmNewPassword) {
      setState({...state, errors: {email: false, oldPassword: false, newPassword: true, confirmNewPassword: true}, form_disabled: false, snack: {message: 'New Password Does Not Match', open: true}});
      return;
    }

    //Check New Password is different from Old Password
    if (state.newPassword === state.oldPassword) {
      setState({...state, errors: {email: false, oldPassword: true, newPassword: true, confirmNewPassword: true}, form_disabled: false, snack: {message: 'New Password Cannot Be The Same As Current Password!', open: true}});
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
        history.push("/login");
        history.go(0);
      }
      //Invalid Credentials
      else if (response.status === 401) {
        setState({...state, errors: {email: true, oldPassword: true, newPassword: false, confirmNewPassword: false}, form_disabled: false, snack: {message: 'Invalid Authentication: Email or old password not recognized.', open: true}});
      }
      //Any other server response
      else {
        setState({...state, errors: {email: false, oldPassword: false, newPassword: false, confirmNewPassword: false}, form_disabled: false, snack: {message: `An error occurred: Password could not be updated`, open: true}});
      }
    } 
    //General Error
    catch (error) {
      setState({...state, errors: {email: false, oldPassword: false, newPassword: false, confirmNewPassword: false}, form_disabled: false, snack: {message: `An error occurred: ${error.message}`, open: true}});
    }
  };

  //Error Message Display: Auto close itself by updating its states
  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState({...state, snack: {...state.snack, open: false}});
  };

  //Render Page
  return ( 
      <div>
          <Navbar/>
           <Grid
                container
                spacing={0}
                alignItems="center"
                justify="center"
                style={{marginTop: "2rem"}}
                >
                <Grid 
                item md={6} xs={12}
                >
               <div className="Border">
                      <Typography variant="h4" className={classes.title}>
                      Reset Password
                      </Typography>
                      <p className={classes.centered} style={{color: "#8d8d8d"}}> Fill out the fields below to reset the password of an existing account </p>
                      <form className={classes.form} onSubmit={handleSubmit}>
                        <TextField label='Email' variant='outlined' type='email' onChange={handleChange('email')} error={state.errors.email}/>
                        <TextField  label='Current Password' variant='outlined' type='password' onChange={handleChange('oldPassword')} error={state.errors.oldPassword}/>
                        <TextField  label='New Password' variant='outlined' type='password' onChange={handleChange('newPassword')} error={state.errors.newPassword}/>
                        <TextField label='Confirm New Password' variant='outlined' type='password' onChange={handleChange('confirmNewPassword')} error={state.errors.confirmNewPassword}/>
                        <ForgotPasswordDialogue/>
                        <div className={classes.centered}>
                            <Button variant="contained" color="primary" type="submit" disabled={state.form_disabled}>Reset</Button>
                        </div>
                      </form>
                      </div>
                </Grid>   
                <Snackbar open={state.snack.open} autoHideDuration={6000} onClose={handleSnackClose} message={state.snack.message}/>
            </Grid> 
      </div>
   
  )
}