/**
 * Individual buttons that handle toggle the display of sections onclick.
 * Toggling is based on props so that they dynamically change.
 *
 * @summary   Individual buttons that toggle the display of sections.
 * @author    Navid Boloorian
 */

import React, { useState, useEffect } from "react";
import "../css/MenuItemCategory.css";
import MenuItem from "./MenuItem";
import MenuItemPopup from "./MenuItemPopup";

const config = require("../config");

const BACKEND_URL = config.backend.uri;

const MenuItemCategory = ({
  categoryName,
  processForm,
  popupVisible,
  popupValues,
  togglePopup,
}) => {
  // array that stores menu items for the current category
  const [menuItems, setMenuItems] = useState([]);
  const menuItemValues = [];

  // utilized to indicate user that loading is happening for this category
  const [loading, setLoading] = useState(false);

  /**
   * useEffect() is called to get information from database
   */
  useEffect(() => {
    // indicate loading to user while call is being made
    setLoading(true);

    fetch(`${BACKEND_URL}item/`).then(async (result) => {
      if (result.ok) {
        const json = await result.json();

        for (let i = 0; i < json.items.length; i++) {
          // since "featured" isn't a category, we need to handle it differently
          const isCategoryEqual = json.items[i].Category === categoryName;
          const isFeatured = categoryName === "Featured" && json.items[i].isFeatured;

          // is stored only if the category name is the same as json's category
          if (json.items !== undefined && (isCategoryEqual || isFeatured)) {
            menuItemValues.push(json.items[i]);
          }
        }
        // update states, and take away loading state
        setMenuItems(menuItemValues);
        setLoading(false);
      } else {
        console.log(`Could not load items for category ${categoryName}`);
      }
    });

    /**
     * sets dependency on categoryName, meaning that whenever categoryName
     * changes, useEffect is called again. This is necessary so that when filters * are clicked data is actually reloaded
     */
  }, [categoryName]);

  // display to user while database call is being made (loading)
  if (loading) {
    return (
      <>
        <div className="menu-item-category">
          <h2> {categoryName} </h2>
          <div className="no-items-available-text">
            {" "}
            <p> Loading... </p>{" "}
          </div>
        </div>
      </>
    );
  }
  // database call finished, show results to user

  return (
    <>
      {/** popup is created here, if it is visible it is rendered */}
      {popupVisible ? (
        <MenuItemPopup values={popupValues} togglePopup={togglePopup} processForm={processForm} />
      ) : null}
      <div className="menu-item-category">
        <h2> {categoryName} </h2>
        {menuItems.length === 0 ? (
          <div className="no-items-available-text">
            {" "}
            <p> No items currently available. </p>{" "}
          </div>
        ) : (
          <div className="menu-item-category-grid">
            {/** generate menu items based off of array */}
            {menuItems.map((menuItem, key) => {
              const title = menuItem.Name;
              const image = menuItem.pictureURL;
              const description = menuItem.Description;
              // since some items will only have a family pricing option, we use individual as the default; if individual doesnt exist, use family instead
              const price =
                "Individual" in menuItem.Prices
                  ? menuItem.Prices.Individual
                  : menuItem.Prices.Family;
              const accommodations = menuItem.Accommodations;
              const priceOptions = menuItem.Prices;
              const { dietaryInfo } = menuItem;
              const id = menuItem._id;

              return (
                <MenuItem
                  title={title}
                  image={image}
                  price={price}
                  description={description}
                  togglePopup={togglePopup}
                  key={key}
                  dietaryInfo={dietaryInfo}
                  priceOptions={priceOptions}
                  accommodations={accommodations}
                  id={id}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MenuItemCategory;
