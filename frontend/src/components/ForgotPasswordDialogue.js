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
    email: '',
    error:{
      display: false,
      message: ''
    }
  });

  const handleSend = async() => {
      const submission = {
          email: state.email
      };

      //Check if email field is empty
    if (state.email === ''){
        setState({...state, error:{display: true, message: "Field cannot be empty!"}})
        return;
    }
    try{
      const response = await fetch(`${BACKEND_URL}user/forgotPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      //Everything went great
      if (response.ok) {
        alert("Email Successfully Sent!");
        handleClose();
      } 
      //Invalid Email
      else if(response.status == 401){
        setState({...state, error:{display: true, message: "Invalid Email"}});
      }
      //Any Server Errors
      else {
            setState({...state, error:{display: true, message: "System Error: Try Again Later"}});
      }
    }
    //General Errors
    catch(error){
        setState({...state, error:{display: true, message: `An error occurred: ${error.message}`}});
    }

  }

  const handleClickOpen = () => {
    setState({...state, email:'', open: true, error:{display: false}});
  };

  const handleClose = () => {
    setState({...state, open: false, error:{display: false}});
  };

  const handleEmailChange = (event) => {
    setState({...state, email: event.target.value, open: true});
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
            error={state.error.display}
            helperText={state.error.display ? state.error.message: null}
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
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
