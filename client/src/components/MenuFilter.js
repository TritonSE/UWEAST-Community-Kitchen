/**
 * Component that groups all filter buttons together. Responsible for sending
 * the relevant props to individual buttons.
 *
 * @summary   Component that groups all filter buttons.
 * @author    Navid Boloorian
 */

import React from "react";
import MenuFilterButton from "./MenuFilterButton";
import "../css/MenuFilter.css";

const MenuFilter = ({
  foodCategories,
  changeVisibleCategories,
  toggledFilter,
  setToggledFilter,
}) => (
  <div className="menu-filter">
    {foodCategories.map((categoryName, key) => (
      // generates filter buttons based on categories
      <MenuFilterButton
        toggledFilter={toggledFilter}
        setToggledFilter={setToggledFilter}
        categoryName={categoryName}
        key={key}
        changeVisibleCategories={changeVisibleCategories()}
      />
    ))}
  </div>
);

export default MenuFilter;
