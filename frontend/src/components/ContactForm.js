import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const sendMessage = e => {
  e.preventDefault();

  const formData = new FormData(e.target);
  let data = {};
  
  for(var [key, value] of formData.entries()) {
    data[key] = value;
  }

  console.log(data);

  fetch("http://localhost:9000/autoEmails/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  alert("Message sent!");
  window.location.reload();
}

const ContactForm = () => {
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
        <TextareaAutosize className="contact-form-input" name="message" placeholder="Your message" maxRows={3} required />
        <br />
        <input type="submit" className="contact-form-submit" value="Submit"  />
      </form>
      </div>
    </div>
  )
}

export default ContactForm;