import React, { Component} from 'react';
import Navbar from '../components/NavBar';
import { 
    Button
  } from '@material-ui/core';
import { Link, Redirect, useHistory } from 'react-router-dom';

import "../css/Custom404.css";

export default function Custom404() {

    const history = useHistory();

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
                        <div className="Background">
                            <img id="Img404" src="https://foodess.com/wp-content/uploads/2018/09/food-photography-gear-2.jpg" alt="Girl in a jacket"/>
                        </div>
                        <section className="Info">
                            <p id="Title-404"> 404 </p>
                            <p id="Description-404"> Page Not Found </p> 
                            <Button variant="contained" onClick={goToHomePage} style={{color: "black", backgroundColor: "#f9ce1d"}}>Back to Home</Button>
                        </section>

                    </div>
                   
                </body>
            </html>

      )
  }