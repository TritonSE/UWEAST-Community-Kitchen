import React, { Component} from 'react';
import Navbar from '../components/NavBar';
import PayPal from '../components/PayPal';

const config = require('../config');

const BACKEND_URL = config.backend.uri;

class About extends Component {

    // For paypal payment handling, we assume the cart passed into the PayPal object looks like...
    // {
    //     item_total: "",
    //     tax_total: "",
    //     items: [
    //         {
    //             name: "",
    //             quantity: "", 
    //             size: "", (Individual or Family)
    //             addons: ["", ""], (Sides, gluten free)
    //             individual_price: "", (price per item)
    //             individual_tax: "", (tax per item)
    //         },

    //     ]
    // }
    
    render (){
    const cart = {
        cart_total: "15.00",
        item_total: "12.00",
        tax_total: "3.00",
        items: [
            {
                name: "Food 1",
                quantity: "2",
                size: "Individual",
                addons: ["Gluten Free"],
                individual_price: "6.00",
                individual_tax: "1.50",
            },
        ]
    }
      return (

          <div>
              <Navbar/>
              <div style={{marginTop: "30px"}}>
                  This is the About Page.
              </div>
              <PayPal cart={cart}/>           
          </div>

      )
    }
  }
  
  export default About;