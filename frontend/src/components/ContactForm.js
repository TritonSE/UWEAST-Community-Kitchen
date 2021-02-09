import React from 'react';

const submitForm = e => {
  e.preventDefault();

  let data = new FormData(e.target);

  console.log(e.target);

  fetch("http://localhost:9000/autoEmails/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
}

const ContactForm = () => {
  return (
    <div className="contact-form">
      <div className="contact-form-text">
      <h1>CONTACT US</h1>
      <p>Please email us using the form below</p>
      <form onSubmit={submitForm}>
        <input type="text" className="first-input contact-form-input" placeholder="Your Name" required/>
        <br />
        <input type="text" className="contact-form-input" placeholder="Your Email" required />
        <br />
        <input type="text" className="contact-form-input" placeholder="Your Message" required />
        <br />
        <input type="submit" className="contact-form-submit" value="Submit"  />
      </form>
      </div>
    </div>
  )
}

export default ContactForm;