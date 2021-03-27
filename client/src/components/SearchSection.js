/**
 * Upper portion of menu page. Has formatting for "jumbotron" background image.
 * 
 * @summary   Upper portion of menu page with main background image.
 * @author    Navid Boloorian
 */

import React, {useState, useEffect} from 'react';
import "../css/SearchSection.css";
import Header from "../media/default_header.jpg";

const config = require('../config');
const BACKEND_URL = config.backend.uri;

const SearchSection = () => {
  // set a default header image here
  var defaultImg = Header

  const [headerImg, setHeaderImg] = useState(""); 

  /**
   * UseEffect gets the background image for the header.
   */
  useEffect(() => {
    fetch(`${BACKEND_URL}menuImages`)
    .then(async result => {
      if (result.ok) {
        const json = await result.json();

        if(json.imageUrl !== undefined && json.imageUrl !== null) {
          setHeaderImg(json.imageUrl.imageUrl);
        }
      }
      else {
        console.log("error");
      }
    })
  }, []);

  return (
    <div className="search-section">
      <img alt="Menu banner" src={headerImg} className="header-img" onError={(e)=>{e.target.src=defaultImg}} />
    </div>
  );
}
  
export default SearchSection;