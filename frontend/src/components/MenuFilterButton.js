import React, { Component} from 'react';
import '../css/MenuFilterButton.css';
const config = require('../config');

const BACKEND_URL = config.backend.uri;

const MenuFilterButton = ( {categoryName, changeVisibleCategories} ) => {

    return (
      <button 
        className="menu-filter-button" 
        onClick={() => changeVisibleCategories(categoryName)}>
        {categoryName} 
      </button>
    )
  }
  
  export default MenuFilterButton;