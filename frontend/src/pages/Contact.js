import React, { Component} from 'react';
import Navbar from '../components/NavBar';
import ContactMap from '../components/ContactMap';
import ContactForm from '../components/ContactForm';
import "../css/Contact.css";
const config = require('../config');

class Contact extends Component {


    render (){
      return (
          <div>
              <Navbar currentPage="contact" />
              <div className="contact-wrapper">
                <div className="contact-map-section">
                    <ContactMap />
                </div>
                <div className="contact-form-section">
                    <ContactForm />
                </div>
              </div>
          </div>

      )
    }
  }
  
  export default Contact;