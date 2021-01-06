import React, { Component} from 'react';
import Navbar from '../components/NavBar';

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