import React, { Component} from 'react';
import Navbar from '../components/NavBar';
import PayPal from '../components/PayPal';
import {getJWT, logout} from '../util/Auth';

const config = require('../config');

const BACKEND_URL = config.backend.uri;

class About extends Component {

    // For paypal payment handling, we assume the cart passed into the PayPal object looks like...
    // {
    //     item_total: "",
    //     tax_total: "",
    //     items: [
    //         items: [
    //         {
    //             name: "",
    //             quantity: "",
    //             size: "",
    //             accommodations: ["", ""],
    //             specialInstructions: "",
    //             individual_price: "",
    //             individual_tax: "",
    //         },
    //     ],
    //
    // }
    
    render (){
    const cart = {
        cart_total: "15.00",
        item_total: "12.00",
        tax_total: "3.00",
        items: [
            {
                quantity: "2",
                size: "Individual",
                accommodations: ["Ketchup, Soy Sauce"],
                specialInstructions: "No salt please!",
                individual_price: "6.00",
                individual_tax: "1.50",
                popupValues: {
                    title: "Food 1"
                }
            },
        ],
        pickup_date: "2021-02-04"
    }

    async function test(){
        const submission = {
            "_id": "603da34392c47d51eb4ad183",
            "customerReceipt": true,
            "adminReceipt": true,
            "token": getJWT(),
        };

        const response = await fetch(`${BACKEND_URL}order/cancelOrder`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submission)
          });
    
          // successful login
          if (response.ok) {
    
            // set admin JWT 
            const json = await response.json();
            alert(json.msg);
          }
          else{
              alert(response.status);
          }
    }
      return (

          <div>
              <Navbar/>
              <div style={{marginTop: "30px"}}>
                  This is the About Page.
              </div>
              <PayPal cart={cart}/>        
              <button onClick={test}> Click Me</button>   
          </div>

      )
    }
  }
  
  export default About;