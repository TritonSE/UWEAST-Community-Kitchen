import React, { useState } from 'react';
import MenuFilter from './MenuFilter';
import MenuItems from './MenuItems';
import MenuItemPopup from './MenuItemPopup';
import '../css/MenuSection.css';
const config = require('../config');

// MenuSection is responsible for managing states for most of the menu
const MenuSection = () => {
  // filterCategories populates the filter buttons
  const filterCategories = ["Featured", "Whole Menu", "Appetizers", "Main Dishes", "Sides", "Drinks"];

  // populates the menu item categories
  const defaultCategories = ["Featured", "Appetizers", "Main Dishes", "Sides", "Drinks"];

  // stores all the categories currently visible
  let displayedCategories = [];

  // states that are managed and passed down to components
  const [visibleCategories, setVisibleCategories] = useState(defaultCategories);

  // stores whether or not the popup is currently visible
  const [popupVisible, setPopupVisible] = useState(false);

  // map with all of the data that will be displayed in the popup
  const [popupValues, setPopupValues] = useState(new Map());

  // changes visible categories when filter button is clicked
  const changeVisibleCategories = categoryName => {
    if(categoryName == "Whole Menu") {
      displayedCategories = defaultCategories;
    }
    else {
      // if the option is not "whole menu", a new item is added to the 
      // displayedCategories array that is then passed to be rendered
      displayedCategories.push(categoryName);
    }

    if(displayedCategories.length == 0) {
      displayedCategories = defaultCategories;
    }
    
    // responsible for actually rendering/setting what will be visible
    setVisibleCategories(displayedCategories);
  }

  // processes the form submitted from the popup
  const processForm = e => {
    // prevents page reload
    e.preventDefault();

    // gets the form data
    var data = new FormData(e.target);
    var object = {};

    // goes through and makes an object from the FormData
    data.forEach((value, key) => {
        if(!Reflect.has(object, key)){
            object[key] = value;
            return;
        }

        if(!Array.isArray(object[key])){
            object[key] = [object[key]];    
        }
        object[key].push(value);
    });

    // converts the FormData to a JSON string, optional
    var json = JSON.stringify(object);
    
    // when submit button is clicked, the popup is closed
    togglePopup();
  }
  
  // closes popup when open and opens popup when closed
  const togglePopup = (title, description, price, image, dietaryInfo) => {
    setPopupVisible(!popupVisible);
    
    // sets the values of the map based on passed-in information
    popupValues.set("title", title);
    popupValues.set("description", description);
    popupValues.set("price", price);
    popupValues.set("image", image);
    popupValues.set("dietary-info", dietaryInfo)

    setPopupValues(popupValues);
  }

  /**
   * MenuSection is split into three columns:
   * 1. filter column
   * 2. menu column
   * 3. cart column
   */
  return (
    <div className="menu-section-wrapper">
      <div className="menu-section">
        <div className="menu-filter-wrapper">
          <MenuFilter foodCategories={filterCategories} changeVisibleCategories={() => changeVisibleCategories} />
        </div>
        <div className="menu-items">
          {/** parameters are states being passed down */}
          <MenuItems foodCategories={visibleCategories} processForm={processForm} popupVisible={popupVisible} popupValues={popupValues} togglePopup={togglePopup} />
        </div>
        <div className="menu-cart">
          cart
      </div>
      </div>
    </div>
  )
}

export default MenuSection;