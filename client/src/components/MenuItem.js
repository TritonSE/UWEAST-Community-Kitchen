/**
 * Component responsible for displaying and formatting items on menu. Bases
 * information on props and displays them accordingly.
 *
 * @summary   Component representing items in the menu.
 * @author    Navid Boloorian
 */

import React from "react";
import "../css/MenuItem.css";

const MenuItem = ({
  description,
  image,
  price,
  title,
  togglePopup,
  dietaryInfo,
  priceOptions,
  accommodations,
  id,
}) => (
  <div
    className="menu-item"
    onClick={() =>
      togglePopup(title, description, priceOptions, image, dietaryInfo, accommodations, id)
    }
  >
    <div className="menu-image">
      <img src={image} alt={title} />
    </div>
    <div className="menu-text">
      <h3 className="menu-name">{title}</h3>
      <p className="menu-description">{description}</p>
    </div>
    <div className="menu-absolutes">
      <p className="menu-price">${price}</p>
    </div>
  </div>
);

export default MenuItem;
