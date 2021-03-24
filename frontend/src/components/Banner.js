/**
 * Banner with disclaimer below navbar.
 * 
 * @summary   Banner with disclaimer below navbar.
 * @author    Navid Boloorian
 */

import React from 'react';
import "../css/Banner.css";

const config = require('../config');
const MIN_CART_TOTAL = config.website.MIN_CART_TOTAL;

const Banner = ({navbarHeight}) => {

    return (
      <div className="banner" style={{top: navbarHeight}}>
        <p>All orders require a ${MIN_CART_TOTAL} MINIMUM and are PICKUP only. All menu items are halal.</p>
      </div>
    )
  }
  
  export default Banner;