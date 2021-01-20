import React, { Component} from 'react';
import Navbar from '../components/NavBar';
import SearchSection from '../components/SearchSection';
import MenuSection from '../components/MenuSection';
import MenuItemPopup from '../components/MenuItemPopup'
const config = require('../config');

const BACKEND_URL = config.backend.uri;

class Menu extends Component {


    render (){

      return (

          <div>
              <Navbar/>
              <SearchSection/>
              <MenuSection/> 
          </div>

      )
    }
  }
  
  export default Menu;