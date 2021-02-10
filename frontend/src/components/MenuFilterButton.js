import React, { Component} from 'react';
import '../css/MenuFilterButton.css';
const config = require('../config');

const BACKEND_URL = config.backend.uri;

const MenuFilterButton = ( {categoryName, changeVisibleCategories, toggledFilter, setToggledFilter} ) => {

    function updateFilters() {
      changeVisibleCategories(categoryName);
      setToggledFilter(categoryName);
    }

    let filterMatch = (categoryName === toggledFilter) && (categoryName != "Whole Menu");

    return (
      <button 
        className={`menu-filter-button ${filterMatch ? "toggled-filter": ""}`}
        onClick={() => (updateFilters())}>
        {categoryName} 
      </button>
    )
  }
  
  export default MenuFilterButton;