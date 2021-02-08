import React from 'react';
import "../css/MenuItem.css";
const config = require('../config');

const MenuItem = ( {description, image, price, title, togglePopup, dietaryInfo} ) => {
    return (
      <div className="menu-item" onClick={() => togglePopup(title, description, price, image, dietaryInfo)}>
        <div className="menu-image">
          <img src={image}></img>
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
}
  
export default MenuItem;