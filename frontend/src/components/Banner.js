import React from 'react';
import MenuFilterButton from './MenuFilterButton';
import "../css/Banner.css";
const config = require('../config');

const MenuFilter = ( {foodCategories, changeVisibleCategories} ) => {
    return (
      <div className="banner">
        <p>All orders require a $20 MINIMUM. All menu items are halal.</p>
      </div>
    )
  }
  
  export default MenuFilter;