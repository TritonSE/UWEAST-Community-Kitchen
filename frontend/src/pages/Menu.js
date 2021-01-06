import React, { Component} from 'react';
import Navbar from '../components/NavBar';
const config = require('../config');

const BACKEND_URL = config.backend.uri;

class Menu extends Component {


    render (){

      return (

          <div>
              <Navbar/>
              <div style={{marginTop: "30px"}}>
                  This is the Menu Page.
              </div>           
          </div>

      )
    }
  }
  
  export default Menu;