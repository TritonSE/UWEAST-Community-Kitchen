import React, { useState } from 'react';
import MenuFilter from './MenuFilter';
import MenuItems from './MenuItems';
import MenuItemPopup from './MenuItemPopup';
import '../css/MenuSection.css';
const config = require('../config');

const BACKEND_URL = config.backend.uri;

const MenuSection = () => {
  const filterCategories = ["Whole Menu", "Appetizers", "Main Dishes", "Sides", "Drinks"];
  const defaultCategories = ["Appetizers", "Main Dishes", "Sides", "Drinks"];
  let displayedCategories = [];

  const [visibleCategories, setVisibleCategories] = useState(defaultCategories);

  const changeVisibleCategories = categoryName => {
    
    if(categoryName == "Whole Menu") {
      displayedCategories = defaultCategories;
    }
    else {
      displayedCategories.push(categoryName);
    }

    if(displayedCategories.length == 0) {
      displayedCategories = defaultCategories;
    }

    setVisibleCategories(displayedCategories);
  }

  return (
    <div className="menu-section-wrapper">
      <div className="menu-section">
        <div className="menu-filter-wrapper">
          <MenuFilter foodCategories={filterCategories} changeVisibleCategories={() => changeVisibleCategories} />
        </div>
        <div className="menu-items">
          <MenuItems foodCategories={visibleCategories} />
        </div>
        <div className="menu-cart">
          right
      </div>
      </div>
    </div>
  )
}

export default MenuSection;