import React, { Component} from 'react';
import Navbar from '../components/NavBar';

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