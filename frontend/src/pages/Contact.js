import React, { Component} from 'react';
import Navbar from '../components/NavBar';

const config = require('../config');

const BACKEND_URL = config.backend.uri;

class Contact extends Component {


    render (){

      return (

          <div>
              <Navbar/>
              <div style={{marginTop: "30px"}}>
                  This is the Contact Page.
              </div>           
          </div>

      )
    }
  }
  
  export default Contact;