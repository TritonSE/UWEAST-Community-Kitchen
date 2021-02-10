import React from 'react';
import '../css/MenuFilterButton.css';

const MenuFilterButton = ( {categoryName, changeVisibleCategories, toggledFilter, setToggledFilter} ) => {

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