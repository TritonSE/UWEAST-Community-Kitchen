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

const config = require('../config');
const BACKEND_URL = config.backend.uri;

export default function FormDialog() {
  //const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    open: false,
    email: ''
  });

  const handleSend = async() => {
      const submission = {
          email: state.email
      };

      //Check if either field is empty
    if (state.email === ''){
        alert("Email Address cannot be empty!");
        //setState({...state, form_disabled: false, snack: {message: 'Please fill out all required fields.', open: true}});
        return;
    }
    try{
      const response = await fetch(`${BACKEND_URL}user/forgotPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      //Successful Login
      if (response.ok) {
        const json = await response.json();
        alert(JSON.stringify(json));
        handleClose();
      }
      //Invalid Credentials
      else {
            const json = await response.json();
            alert(JSON.stringify(json));
        //setState({...state, form_disabled: false, snack: {message: 'Email or password not recognized.', open: true}});
      }
    }
    catch(error){
        alert("ERRROR");
    }

  }

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const submission = {
//       email: state.email,
//       password: state.password
//     };

//     //Check if either field is empty
//     if (state.email === '' || state.password === ''){
//         //setState({...state, form_disabled: false, snack: {message: 'Please fill out all required fields.', open: true}});
//         return;
//     }
//     //Check Password Length
//     if (submission.password.length < 6) {
//       //setState({...state, form_disabled: false, snack: {message: 'Password must be at least 6 characters long.', open: true}});
//       return;
//     }
//     try {
//         //Attempt to login with given credentials 
//       const response = await fetch(`${BACKEND_URL}user/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(submission)
//       });

//       //Successful Login
//       if (response.ok) {
//         const json = await response.json();
//       }
//       //Invalid Credentials
//       else if (response.status === 401) {
//         //setState({...state, form_disabled: false, snack: {message: 'Email or password not recognized.', open: true}});
//       }
//       //Any other server response
//       else {
//         const text = await response.text();
//         //setState({...state, form_disabled: false, snack: {message: `Could not log in: ${text}`, open: true}});
//       }
//     } 
//     //General Error
//     catch (error) {
//       //setState({...state, form_disabled: false, snack: {message: `An error occurred: ${error.message}`, open: true}});
//     }
//   };

  const handleClickOpen = () => {
    setState({open: true});
  };

  const handleClose = () => {
    setState({open: false});
  };

  const handleEmailChange = (event) => {
    setState({email: event.target.value, open: true});
  }

  return (
    <div>
      <Link onClick={handleClickOpen}><Typography>Forgot Password?</Typography></Link>
      <Dialog open={state.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Forgot Password?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the email address of the associated account here. An email will be sent to
            you there containing next steps. 
          </DialogContentText>
          <TextField
            onChange={handleEmailChange}
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSend} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
