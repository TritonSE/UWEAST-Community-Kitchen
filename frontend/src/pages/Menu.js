import React, { Component} from 'react';
import Navbar from '../components/NavBar';
import SearchSection from '../components/SearchSection';
import MenuSection from '../components/MenuSection';
import Banner from '../components/Banner';
const config = require('../config');

const BACKEND_URL = config.backend.uri;

class Menu extends Component {


    render (){

      return (
          <div>
              <div className="navbar-wrapper">
                <Navbar currentPage="menu"/>
              </div>
              <Banner/>
              {/** search section is the top, non-menu half of the page */}
              <SearchSection/>
              <MenuSection/> 
          </div>

      )
    }
  }
  
  export default Menu;