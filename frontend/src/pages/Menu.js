import React, { Component} from 'react';
import Navbar from '../components/NavBar';
import CartPreview from '../components/CartPreview';
import SearchSection from '../components/SearchSection';
import MenuSection from '../components/MenuSection';
import MenuItemPopup from '../components/MenuItemPopup'
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
              {/** search section is the top, non-menu half of the page */}
              <SearchSection/>
              <MenuSection/> 
          </div>

      )
    }
  }
  
  export default Menu;