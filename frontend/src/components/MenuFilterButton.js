/**
 * Individual buttons that handle toggle the display of sections onclick. 
 * Toggling is based on props so that they dynamically change.
 * 
 * @summary   Individual buttons that toggle the display of sections.
 * @author    Navid Boloorian
 */

import React from 'react';
import '../css/MenuFilterButton.css';

const MenuFilterButton = ( {categoryName, changeVisibleCategories, toggledFilter, setToggledFilter} ) => {

    /**
     * Function that groups the filter toggling state calls.
     */
    function updateFilters() {
      changeVisibleCategories(categoryName);
      setToggledFilter(categoryName);
    }

    // logic to check whether or not the filter button should be highlighted
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