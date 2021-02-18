/**
 * Banner with disclaimer below navbar.
 * 
 * @summary   Banner with disclaimer below navbar.
 * @author    Navid Boloorian
 */

import React from 'react';
import "../css/Banner.css";

const MenuFilter = ( {foodCategories, changeVisibleCategories} ) => {
    return (
      <div className="banner">
        <p>All orders require a $20 MINIMUM</p>
      </div>
    )
  }
  
  export default MenuFilter;