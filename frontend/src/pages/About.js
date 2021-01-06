import React, { Component} from 'react';
import Navbar from '../components/NavBar';
import PayPal from '../components/PayPal';

const config = require('../config');

const BACKEND_URL = config.backend.uri;

class About extends Component {


    render (){

      return (

          <div>
              <Navbar/>
              <div style={{marginTop: "30px"}}>
                  This is the About Page.
              </div>
              <PayPal amount={8.0}/>           
          </div>

      )
    }
  }
  
  export default About;