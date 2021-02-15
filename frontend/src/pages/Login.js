import React from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { 
  TextField, Button,  
  Snackbar, Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import '../css/Login.css';
import { isAuthenticated, setJWT, setUser } from '../util/auth';
import Navbar from '../components/NavBar';
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

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    email: '',
    password: '',
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
  // Validates form data for completion/length, making a backend request to Users DB for user authetnication. If
  // user is authenticated, user is redirected to admin page. Otherwise, an error message appears. 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({ ...state, form_disabled: true });
    const submission = {
      email: state.email,
      password: state.password
    };

    //Check if either field is empty
    if (state.email === '' || state.password === ''){
        setState({...state, form_disabled: false, snack: {message: 'Please fill out all required fields.', open: true}});
        return;
    }
    //Check Password Length
    if (submission.password.length < 6) {
      setState({...state, form_disabled: false, snack: {message: 'Password must be at least 6 characters long.', open: true}});
      return;
    }
    try {
        //Attempt to login with given credentials 
      const response = await fetch(`${BACKEND_URL}user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      //Successful Login
      if (response.ok) {
        const json = await response.json();
        setJWT(json.token);
        setUser(json.email);
        history.push("/admin");
      }
      //Invalid Credentials
      else if (response.status === 401) {
        setState({...state, form_disabled: false, snack: {message: 'Email or password not recognized.', open: true}});
      }
      //Any other server response
      else {
        const text = await response.text();
        setState({...state, form_disabled: false, snack: {message: `Could not log in: ${text}`, open: true}});
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

  //If user is already logged in, then redirect to Admin Page. Else display Login page. 
  return isAuthenticated() ? <Redirect to="/admin"/> : ( 
      <div>
            <Navbar/>
            <div className="Main">
              <div className="Border">
                <Typography variant="h4" className={classes.title} style={{fontSize: "2.5rem"}} > Login </Typography>
                <p className={classes.centered} style={{color: "#8d8d8d"}}> Sign-in into an existing account below </p>
                <form className={classes.form} onSubmit={handleSubmit}>
                      <TextField label='Email' variant='outlined' type='email' onChange={handleChange('email')}/>
                      <TextField label='Password' variant='outlined' type='password' onChange={handleChange('password')}/>
                      <Link to="register" className="Child"><Typography>Register Account</Typography></Link>
                      <Link to="reset-password"><Typography>Reset Password</Typography></Link>
                      <div className={classes.centered}>
                          <Button variant="contained" color="primary" type="submit" disabled={state.form_disabled}
                          // style={{fontWeight: "bolder", borderRadius: "3px", fontSize: "16px"}}
                          >Login</Button>
                      </div>
                  </form>
                </div>
              </div>
              <Snackbar open={state.snack.open} autoHideDuration={6000} onClose={handleSnackClose} message={state.snack.message}/>
      </div>
   
  )
}