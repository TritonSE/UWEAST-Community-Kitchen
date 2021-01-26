import React, { Component } from 'react';
import SearchBar from "./SearchBar";
import "../css/SearchSection.css";
const config = require('../config');

const BACKEND_URL = config.backend.uri;

const SearchSection = () => {
    return (
      <div className="search-section">
        <div className="searchbar-box">
          <h2>Order food online now!</h2>
          <SearchBar />
        </div>
      </div>
    );
}
  
export default SearchSection;