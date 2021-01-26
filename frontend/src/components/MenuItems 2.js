import React from 'react';
import MenuItemCategory from './MenuItemCategory';
import '../css/MenuItems.css';
const config = require('../config');

const BACKEND_URL = config.backend.uri;

const MenuItems = ({ foodCategories, processForm, popupVisible, popupValues, togglePopup }) => {
  return (

      <div className="menu-items">
        {/** generates categories in the menu */}
        {foodCategories.map((categoryName, key) => {
          return <MenuItemCategory key={key} categoryName={categoryName} key={key} processForm={processForm} popupVisible={popupVisible} popupValues={popupValues} togglePopup={togglePopup} />
        })}
      </div>

  )
}
  
  export default MenuItems;