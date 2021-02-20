/**
 * Groups MenuItemCategory components for formatting purposes. Renders 
 * categories based off of what is being displayed with filters/states. 
 * Simplifies passing of props as it centralizes the components.
 * 
 * @summary   Grouping of MenuItemCategory components.
 * @author    Navid Boloorian
 */

import React from 'react';
import MenuItemCategory from './MenuItemCategory';
import '../css/MenuItems.css';

const MenuItems = ({ foodCategories, processForm, popupVisible, popupValues, togglePopup }) => {

  return (

      <div className="menu-items">
        {/** generates categories in the menu */}
        {foodCategories.map((categoryName, key) => {
          return <MenuItemCategory key={key} categoryName={categoryName} key={key} processForm={processForm} popupVisible={popupVisible} popupValues={popupValues} togglePopup={togglePopup}/>
        })}
      </div>

  )
}
  
  export default MenuItems;