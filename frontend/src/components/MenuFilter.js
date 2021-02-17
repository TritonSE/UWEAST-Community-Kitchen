/**
 * MenuFilter is the component which stores all of the menu filter buttons. 
 */

import React, { Component} from 'react';
import MenuFilterButton from './MenuFilterButton';
import "../css/MenuFilter.css";
const config = require('../config');

const MenuFilter = ( {foodCategories, changeVisibleCategories, toggledFilter, setToggledFilter} ) => {
    return (
      <div className="menu-filter">
        {foodCategories.map((categoryName, key) => (
          // generates filter buttons based on categories
          <MenuFilterButton toggledFilter={toggledFilter} setToggledFilter={setToggledFilter} categoryName={categoryName} key={key} changeVisibleCategories={changeVisibleCategories()} />
        ))}
      </div>
    )
  }
  
  export default MenuFilter;