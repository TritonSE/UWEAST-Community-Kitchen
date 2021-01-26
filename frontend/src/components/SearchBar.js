import React, { Component } from 'react';
const config = require('../config');

const BACKEND_URL = config.backend.uri;

const SearchBar = ( {keyword, setKeyword} ) => {
    return (
      <input
        key="searchkey"
        placeholder="search food"
      />
    );
}
  
export default SearchBar;