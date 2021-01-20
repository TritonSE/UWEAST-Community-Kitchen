import React, { Component} from 'react';
import MenuFilterButton from './MenuFilterButton';
import "../css/MenuFilter.css";
const config = require('../config');

const BACKEND_URL = config.backend.uri;

const MenuFilter = ( {foodCategories, changeVisibleCategories} ) => {
    return (
      <div className="menu-filter">
        {foodCategories.map((categoryName, key) => (
          <MenuFilterButton categoryName={categoryName} key={key} changeVisibleCategories={changeVisibleCategories()} />
        ))}
      </div>
    )
  }
  
  export default MenuFilter;