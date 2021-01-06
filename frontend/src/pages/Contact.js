import React, { Component} from 'react';
import Navbar from '../components/NavBar';

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