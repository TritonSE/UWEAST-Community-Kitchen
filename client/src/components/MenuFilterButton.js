/**
 * Individual buttons that handle toggle the display of sections onclick.
 * Toggling is based on props so that they dynamically change.
 *
 * @summary   Individual buttons that toggle the display of sections.
 * @author    Navid Boloorian
 */

// import React from 'react';
import React, { useEffect } from "react";
import "../css/MenuFilterButton.css";

const MenuFilterButton = ({
  categoryName,
  changeVisibleCategories,
  toggledFilter,
  setToggledFilter,
}) => {
  // on load of screen, default filter button highlighted
  useEffect(() => {
    categoryName = "Whole Menu";
    updateFilters();
  }, []);

  /**
   * Function that groups the filter toggling state calls.
   */
  function updateFilters() {
    changeVisibleCategories(categoryName);
    setToggledFilter(categoryName);
  }

  // logic to check whether or not the filter button should be highlighted
  const filterMatch = categoryName === toggledFilter;

  return (
    <button
      className={`menu-filter-button ${filterMatch ? "toggled-filter" : ""}`}
      onClick={() => updateFilters()}
    >
      <span>{categoryName}</span>
    </button>
  );
};

export default MenuFilterButton;
