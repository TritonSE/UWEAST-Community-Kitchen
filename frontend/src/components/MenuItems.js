import React, { Component} from 'react';
import MenuItemCategory from './MenuItemCategory';
import '../css/MenuItems.css';
import MenuItem from './MenuItem';
const config = require('../config');

const BACKEND_URL = config.backend.uri;

const MenuItems = ({ foodCategories}) => {
  return (

      <div className="menu-items">
        {foodCategories.map((categoryName, key) => (
          <MenuItemCategory categoryName={categoryName} key={key} />
        ))}
      </div>

  )
}
  
  export default MenuItems;