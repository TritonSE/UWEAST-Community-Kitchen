/**
 * Banner is the disclaimer banner that appears under the navbar.
 */

import React from 'react';
import MenuFilterButton from './MenuFilterButton';
import "../css/Banner.css";
const config = require('../config');

const MenuFilter = ( {foodCategories, changeVisibleCategories} ) => {
    return (
      <div className="banner">
        <p>All orders require a $20 MINIMUM</p>
      </div>
    )
  }
  
  export default MenuFilter;