/**
 * This page renders the contact page which has the contact form and map.
 *
 * @summary   Renders the contact page.
 */

import React from "react";
import Navbar from "../components/NavBar";
import ContactMap from "../components/ContactMap";
import ContactForm from "../components/ContactForm";
import "../css/Contact.css";
import CookiesBanner from "../components/CookiesBanner";

const Contact = () => (
  <div>
    <Navbar />
    <div className="contact-wrapper">
      <div className="contact-map-section">
        <ContactMap />
      </div>
      <div className="contact-form-section">
        <ContactForm />
      </div>
    </div>
    <CookiesBanner />
  </div>
);

export default Contact;
