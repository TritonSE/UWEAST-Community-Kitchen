/**
  * This file renders the custom 404 page, which is used whenever a user
  * attempts to go to an invalid URL on the site. 
  *
  * @summary    Renders custom 404 page. 
  * @author     Amrit Kaur Singh
  */

import React from 'react';
import Navbar from '../components/NavBar';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import "../css/Custom404.css";

export default function Custom404() {

    const history = useHistory();

    // redirects users to home page 
    function goToHomePage(){
        history.push("/");
        return;
    }
    
      return (

            <html className="Account-Html">
                <body className="Account-Body">
                    <div className="NavBar">
                            <Navbar/>
                    </div>
                    <div className="Main">
                        {/* Image on lefthand side */}
                        <div className="Background"> 
                            {/* Cite the image source */}
                            <div style={{position: "absolute", bottom: "0", left: "0",  textAlign:"right", color: "white",  textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000"}}> 
                                Photo by Dan Gold on Unsplash 
                            </div> 
                        </div>
                        {/* Information and redirect button on righthand side */}
                        <section className="Info">
                            <p id="Title-404"> 404 </p>
                            <p id="Description-404"> Page Not Found</p> 
                            <Button variant="contained" onClick={goToHomePage} style={{color: "black", backgroundColor: "#f9ce1d"}}>Back to Home</Button>
                        </section>

                    </div>
                   
                </body>
            </html>

      )
  }