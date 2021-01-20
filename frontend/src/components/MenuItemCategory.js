import React, { useState, useEffect} from 'react';
import '../css/MenuItemCategory.css';
import MenuItem from './MenuItem';
import MenuItemPopup from './MenuItemPopup';
const config = require('../config');

const BACKEND_URL = config.backend.uri;

const MenuItemCategory = ({ categoryName }) => {
  /**
   * useEffect(() => {
    fetch("http://localhost:9000/item/insert", {
      method: 'POST',
      body: JSON.stringify({
        'vegan' : true,
        'vegetarian' : true,
        'glutenFree' : true,
        'ingredients' : "apple, banana",
        'price': '5'
      })
    })
    .then(async result => {
      console.log(result);
    })
    .catch(e => {
      console.log(e);
    });
  }, []);
   */

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupValues, setPopupValues] = useState(new Map());

  const togglePopup = (title, description, price, image) => {
    setPopupVisible(!popupVisible);
    
    popupValues.set("title", title);
    popupValues.set("description", description);
    popupValues.set("price", price);
    popupValues.set("image", image);

    setPopupValues(popupValues);
  }
  
  return (
      <>
        {popupVisible ? <MenuItemPopup name="hello" values={popupValues} togglePopup={togglePopup}/> : null}
        <div className="menu-item-category">
          <h2> {categoryName} </h2>
          <div className="menu-item-category-grid">
            <MenuItem image="https://images2.minutemediacdn.com/image/upload/c_crop,h_1126,w_2000,x_0,y_181/f_auto,q_auto,w_1100/v1554932288/shape/mentalfloss/12531-istock-637790866.jpg" title="Food Item 1" description="Food Description 1" price="5" togglePopup={togglePopup} />
            <MenuItem image="https://images2.minutemediacdn.com/image/upload/c_crop,h_1126,w_2000,x_0,y_181/f_auto,q_auto,w_1100/v1554932288/shape/mentalfloss/12531-istock-637790866.jpg" title="Food Item 2" description="Food Description 2" price="5" togglePopup={togglePopup} />
            <MenuItem image="https://images2.minutemediacdn.com/image/upload/c_crop,h_1126,w_2000,x_0,y_181/f_auto,q_auto,w_1100/v1554932288/shape/mentalfloss/12531-istock-637790866.jpg" title="Food Item 3" description="Food Description 3" price="5" togglePopup={togglePopup} />
            <MenuItem image="https://images2.minutemediacdn.com/image/upload/c_crop,h_1126,w_2000,x_0,y_181/f_auto,q_auto,w_1100/v1554932288/shape/mentalfloss/12531-istock-637790866.jpg" title="Food Item 4" description="Food Description 4" price="5" togglePopup
            ={togglePopup} />
          </div>
        </div>
      </>
  )
}
  
  export default MenuItemCategory;