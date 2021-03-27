/**
 * Banner with disclaimer below navbar.
 * 
 * @summary   Banner with disclaimer below navbar.
 * @author    Navid Boloorian
 */

import React from 'react';
import "../css/Banner.css";
import {MIN_CART_TOTAL_CHECKOUT} from '../util/constants.js';

const Banner = ({navbarHeight}) => {

    return (
      <div className="banner" style={{top: navbarHeight}}>
        <p>All orders require a ${MIN_CART_TOTAL_CHECKOUT} MINIMUM and are PICKUP only. All menu items are halal.</p>
      </div>
    )
  }
  
  export default Banner;