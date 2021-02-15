import React from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { 
  TextField, Button, Grid, 
  Snackbar, Typography 
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { isAuthenticated, setJWT, setUser } from '../util/auth';
import Navbar from '../components/NavBar';
import "../css/Register.css";
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
    //Input Field - Label Layout 
    '& .MuiFormLabel-root': {
        color: 'black',
      },
      //Input Field - Border Layout 
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
        border: '1px solid black'
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

export default function Register() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    email: '',
    password: '',
    passwordConfirmation: '',
    secret: '',
    snack: {
      message: '',
      open: false
    },
    form_disabled: false
  });

  // Updates given state with given value 
  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  // Handles submission of the form (button click)
  // Validates form data for completion/length, making a backend request to Users DB for secret key autentication + 
  // email uniqueness. If register succeeds, user is redirected to admin page and added to user DB. Otherwise, an error message appears. 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({ ...state, form_disabled: true });

    const submission = {
      email: state.email,
      password: state.password,
      secret: state.secret
    };

    //Check if any field is empty
    if (state.email === '' || state.password === '' || state.secret === ''){
        setState({...state, form_disabled: false, snack: {message: 'Please fill out all required fields.', open: true}});
        return;
    }
    //Check Password Length
    if (submission.password.length < 6) {
      setState({...state, form_disabled: false, snack: {message: 'Password must be at least 6 characters long.', open: true}});
      return;
    }

    //Check Passwords Match
    if (state.password !== state.passwordConfirmation) {
      setState({...state, form_disabled: false, snack: {message: 'Passwords Do Not Match.', open: true}});
      return;
    }

    try {
        //Attempt to register with given credentials 
      const response = await fetch(`${BACKEND_URL}user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      //Successful Registration
      if (response.ok) {
        const json = await response.json();
        setJWT(json.token);
        setUser(json.email);
        history.push("/admin");
      }
      //Invalid Credentials 
      else if (response.status === 401) {
        setState({...state, form_disabled: false, snack: {message: 'Could not register account: Invalid Secret Key!', open: true}});
      }
       //Duplicate User 
      else if (response.status === 409) {
        setState({...state, form_disabled: false, snack: {message: 'Could not register account: Email already in use!', open: true}});
      }
      //Any other server response
      else {
        const text = await response.text();
        setState({...state, form_disabled: false, snack: {message: `Could not register account: ${text}`, open: true}});
      }
    } 
    //General Error
    catch (error) {
      setState({...state, form_disabled: false, snack: {message: `An error occurred: ${error.message}`, open: true}});
    }
  };

  //Error Message Display: Auto close itself by updating its states
  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState({...state, snack: {...state.snack, open: false}});
  };

  //If user is already logged in, then redirect to Admin Page. Else display Register page. 
  return isAuthenticated() ? <Redirect to="/admin"/> : ( 
      <div>
          <Navbar/>
           <Grid
                container
                spacing={0}
                alignItems="center"
                justify="center"
                style={{marginTop: "2rem"}}
                >
                <Grid item md={6} xs={12}>
                <div className="Border">
                    <Typography variant="h4" className={classes.title}>
                    Register New Account
                    </Typography>
                    <p className={classes.centered} style={{color: "#8d8d8d"}}> Fill out the fields below to create a new account </p>
                    <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField label='Email' variant='outlined' type='email' onChange={handleChange('email')}/>
                    <TextField label='Password' variant='outlined' type='password' onChange={handleChange('password')}/>
                    <TextField label='Confirm Password' variant='outlined' type='password' onChange={handleChange('passwordConfirmation')}/>
                    <TextField label='Secret Key' variant='outlined' type='password' onChange={handleChange('secret')}/>
                    <Link to="login"><Typography>Already have an account? Sign-In</Typography></Link>
                    <div className={classes.centered}>
                        <Button variant="contained" color="primary" type="submit" disabled={state.form_disabled}>Register</Button>
                    </div>
                    </form>
                  </div>
                    
                </Grid>   
                <Snackbar open={state.snack.open} autoHideDuration={6000} onClose={handleSnackClose} message={state.snack.message}/>
            </Grid> 
      </div>
   
  )
}