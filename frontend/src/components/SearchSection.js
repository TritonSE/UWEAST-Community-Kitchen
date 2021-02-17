/**
 * SearchSection represents the upper portion of the menu page. It is formatted 
 * to display the background image.
 */

import React, { Component } from 'react';
import "../css/SearchSection.css";
const config = require('../config');

const BACKEND_URL = config.backend.uri;

const SearchSection = () => {
    return (
      <div className="search-section"></div>
    );
}
  
export default SearchSection;