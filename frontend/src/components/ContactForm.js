import React from 'react';

export const ContactForm = () => {
  return (
    <div className="contact-form">
      <div className="contact-form-text">
      <h1>CONTACT US</h1>
      <p>Please email us using the form below</p>
      <form>
        <input type="text" className="first-input contact-form-input" placeholder="Your Name" required/>
        <br />
        <input type="text" className="contact-form-input" placeholder="Your Email" required />
        <br />
        <input type="text" className="contact-form-input" placeholder="Your Message" required />
        <br />
        <input type="submit" className="contact-form-submit" value="Submit" />
      </form>
      </div>
    </div>
  )
}

export default ContactForm;