/**
 * Individual buttons that handle toggle the display of sections onclick. 
 * Toggling is based on props so that they dynamically change.
 * 
 * @summary   Individual buttons that toggle the display of sections.
 * @author    Navid Boloorian
 */

import React, { useState, useEffect} from 'react';
import '../css/MenuItemCategory.css';
import MenuItem from './MenuItem';
import MenuItemPopup from './MenuItemPopup';

const config = require('../config');
const BACKEND_URL = config.backend.uri;

const MenuItemCategory = ({ categoryName, processForm, popupVisible, popupValues, togglePopup }) => {
  // array that stores menu items for the current category
  const [menuItems, setMenuItems] = useState(new Array());
  const menuItemValues = [];

  /**
   * useEffect() is called to get information from database
   */
  useEffect(() => {
    fetch(`${BACKEND_URL}item/`)
    .then(async result => {
      if (result.ok) {
        const json = await result.json();

        for(var i = 0; i < json.items.length; i++) {
          // since "featured" isn't a category, we need to handle it differently
          let isCategoryEqual = json.items[i].Category === categoryName;
          let isFeatured = (categoryName === "Featured") && (json.items[i].isFeatured);

          // is stored only if the category name is the same as json's category
          if((json.items !== undefined) && (isCategoryEqual || isFeatured)) {
            menuItemValues.push(json.items[i]);
          }
        }
        setMenuItems(menuItemValues);
      }
      else {
        console.log("error");
      }
    })

  /**
   * sets dependency on categoryName, meaning that whenever categoryName 
   * changes, useEffect is called again. This is necessary so that when filters * are clicked data is actually reloaded
   */
  }, [categoryName]);
  
  return (
      <>
        {/** popup is created here, if it is visible it is rendered */}
        {popupVisible ? <MenuItemPopup values={popupValues} togglePopup={togglePopup} processForm={processForm} /> : null}
        <div className="menu-item-category">
          <h2> {categoryName} </h2>
          <div className="menu-item-category-grid">
            {/** generate menu items based off of array */}
            {menuItems.map((menuItem, key) => {
              let title = menuItem.Name;
              let image = menuItem.pictureURL;
              let description = menuItem.Description;
              // since some items will only have a family pricing option, we use individual as the default; if individual doesnt exist, use family instead
              let price = ("Individual" in menuItem.Prices) ? menuItem.Prices.Individual : menuItem.Prices.Family
              let accommodations = menuItem.Accommodations;
              let priceOptions = menuItem.Prices;
              let dietaryInfo = menuItem.dietaryInfo;
              let id = menuItem._id;

              return <MenuItem title={title} image={image} price={price} description={description} togglePopup={togglePopup} key={key} dietaryInfo={dietaryInfo} priceOptions={priceOptions} accommodations={accommodations} id={id}/>
            })}
          </div>
        </div>
      </>
  )
}

export default MenuItemCategory;
