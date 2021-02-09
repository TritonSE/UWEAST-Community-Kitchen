import React, { Component } from 'react';
import SearchBar from "./SearchBar";
import "../css/SearchSection.css";
const config = require('../config');

const BACKEND_URL = config.backend.uri;

const SearchSection = () => {
    return (
      <div className="search-section"></div>
    );
}
  
export default SearchSection;