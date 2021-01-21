import React, { Component} from 'react';
import Navbar from '../components/NavBar';
import CartPreview from '../components/CartPreview';
const config = require('../config');

const BACKEND_URL = config.backend.uri;

class Menu extends Component {


    render (){

      return (

          <div>
              <Navbar currentPage="menu"/>
              <div style={{marginTop: "30px"}}>
                  This is the Menu Page.
              </div>           
              <CartPreview/> 
          </div>

      )
    }
  }
  
  export default Menu;