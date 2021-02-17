/**
 * ContactForm is the component that manages the processing of the form on the 
 * contact page. In order to function properly, there must be at least one 
 * email in the db.
 */

import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Snackbar} from '@material-ui/core';

const ContactForm = () => {

  const [state, setState] = React.useState({
    snack: {
      message: '',
      open: false
    },
  });

  const sendMessage = async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    let data = {};
    
    // make FormData into a js object to pass to route
    for(var [key, value] of formData.entries()) {
      data[key] = value;
    }
  
    try{
  
      const response = await fetch("http://localhost:9000/autoEmails/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
      });
      
      //Successful response
      if (response.status == 200){
        alert("Message sent!");
        // reload window to clear input boxes 
        window.location.reload();
        
        //Malformed Email
      } else if(response.status == 400) {
        setState({...state, snack: {message: 'Invalid Email Address!', open: true}});

        //System Error
      } else {
        setState({...state, snack: {message: 'System Error: Cannot send email!', open: true}});
      }
      
      //General Error
    } catch(error){
      setState({...state, snack: {message: 'System Error: Cannot send email!', open: true}});
    }
  };
  
  //Error Message Display: Auto close itself by updating its states
  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState({...state, snack: {open: false}});
  };

  return (
    <div className="contact-form">
      <div className="contact-form-text">
      <h1>CONTACT US</h1>
      <p>Please email us using the form below</p>
      <form onSubmit={sendMessage}>
        <input type="text" name="name" className="first-input contact-form-input" placeholder="Your Name" required/>
        <br />
        <input type="text" name="email" className="contact-form-input" placeholder="Your Email" required />
        <br />
        {/** automatically-resizing textarea component */}
        <TextareaAutosize className="contact-form-input" name="message" placeholder="Your message" maxRows={3} required />
        <br />
        <input type="submit" className="contact-form-submit" value="Submit"  />
      </form>
      </div>
      <Snackbar open={state.snack.open} autoHideDuration={6000} onClose={handleSnackClose} message={state.snack.message}/>
    </div>
  )
}

export default ContactForm;