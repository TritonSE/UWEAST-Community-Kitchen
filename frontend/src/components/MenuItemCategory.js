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

  // useEffect() is called to get information from database
  useEffect(() => {
    fetch("http://localhost:9000/item/")
    .then(async result => {
      if (result.ok) {
        const json = await result.json();

        for(var i = 0; i < json.items.length; i++) {
          let isCategoryEqual = json.items[i].category == categoryName;
          let isFeatured = (categoryName == "Featured") && (json.items[i].featured);

          // is stored only if the category name is the same as json's category
          if((json.items != undefined) && (isCategoryEqual || isFeatured)) {
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
              let title = menuItem.name;
              let image = menuItem.image;
              let description = menuItem.description;
              let price = menuItem.price;
              let dietaryInfo = [menuItem.vegan, menuItem.vegetarian, menuItem.glutenFree];

              return <MenuItem title={title} image={image} price={price} description={description} togglePopup={togglePopup} key={key} dietaryInfo={dietaryInfo} />
            })}
          </div>
        </div>
      </>
  )
}
  
  export default MenuItemCategory;