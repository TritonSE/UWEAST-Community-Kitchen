import React, { Component } from 'react';
import "../css/MenuItem.css";
const config = require('../config');

const BACKEND_URL = config.backend.uri;

const MenuItem = ( {image, title, description, price, togglePopup} ) => {
    return (
      <div className="menu-item" onClick={() => togglePopup(title, description, price, image)}>
        <div className="menu-image">
          <img src={image}></img>
        </div>
        <div className="menu-text">
          <h3 className="menu-title">{title}</h3>
          <p className="menu-description">{description}</p>
          <p className="menu-price">{price}</p>
        </div>
      </div>
    );
}
  
export default MenuItem;