import React, { Component} from 'react';
import Navbar from '../components/NavBar';

const config = require('../config');

const BACKEND_URL = config.backend.uri;

class Admin extends Component {


    render (){

      return (

          <div>
              <Navbar/>
              <div style={{marginTop: "30px"}}>
                  This is the Admin Page.
              </div>           
          </div>

      )
    }
  }
  
  export default Admin;