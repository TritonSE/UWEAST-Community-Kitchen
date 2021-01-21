import React, { useState } from 'react';
import MenuItemCategory from './MenuItemCategory';
import '../css/MenuItemPopup.css';
const config = require('../config');

const BACKEND_URL = config.backend.uri;

const MenuItemPopup = ({ values, togglePopup }) => {
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(values.get("price"));
  const indvidualPrice = values.get("price");
  const familyPrice = parseInt(indvidualPrice) + 5;

  let currPrice = indvidualPrice;

  const processForm = e => {
    e.preventDefault();
    var data = new FormData(e.target);
    var object = {};

    data.forEach((value, key) => {
        if(!Reflect.has(object, key)){
            object[key] = value;
            return;
        }

        if(!Array.isArray(object[key])){
            object[key] = [object[key]];    
        }
        object[key].push(value);
    });

    var json = JSON.stringify(object);
    togglePopup();
  }

  const changeQuantity = sign => {
    if(sign == "+") {
      setQuantity(quantity + 1);
      changeTotalPrice(5);
    }
    else if(sign == "-") {
      if(quantity > 1) {
        setQuantity(quantity - 1);
        changeTotalPrice(3);
      }
    }
  }

  const changeTotalPrice = () => {
    setTotalPrice(currPrice * (quantity + 1));
  }

  const changePrice = newPrice => {
    currPrice = newPrice;

    changeTotalPrice();
  }

  return (
    <>
      <div className="greyout" onClick={togglePopup}></div>
      <div className="menu-item-popup">
        <span className="close-button" onClick={togglePopup}>+</span>
        <div className="left-popup">
          <img src={values.get("image")} />
        </div>
        <div className="right-popup">
          <form onSubmit={processForm} id="popup-form">
            <h2 className="title-popup">{values.get("title")}</h2>
            <input type="hidden" name="title" value={values.get("title")} />
            <h2 className="desc-popup">{values.get("description")}</h2>
            <div className="size-section">
              <div className="section-title">
                <h3>Choose Size</h3>
                <i>required</i>
              </div>
              <label className="choice-label">
                <input onClick={() => changePrice(indvidualPrice)} type="radio" name="size" value="individual" required />
                <span onClick={() => changePrice(indvidualPrice)} className="label-title">Individual</span>
              </label>
              <label className="choice-label">
                <input onClick={() => changePrice(familyPrice)} type="radio" name="size" value="family" required />
                <span onClick={() => changePrice(familyPrice)} className="label-title">Family</span>
              </label>
            </div>
            <div className="size-section">
              <div className="section-title">
                <h3>Dietary Options</h3>
                <i>optional</i>
              </div>
              <label className="choice-label">
                <input type="checkbox" name="dietary" value="vegetarian" />
                <span className="label-title">Vegetarian</span>
              </label>
              <label className="choice-label">
                <input type="checkbox" name="dietary" value="vegan" />
                <span className="label-title">Vegan</span>
              </label>
              <label className="choice-label">
                <input type="checkbox" name="dietary" value="gluten free" />
                <span className="label-title">Gluten-Free</span>
              </label>
            </div>
            <div className="instructions-section">
              <div className="section-title">
                <h3>Special Instructions</h3>
                <i>optional</i>
              </div>
              <textarea name="instructions" className="instructions-textarea" />
            </div>
            <div className="quantity-section">
              <div className="section-title"><h3>Quantity</h3></div>
              <div className="quantity-buttons">
                <button type="button" className="button decrease-button" onClick={
                  () => {
                    changeQuantity("-")
                    changeTotalPrice();
                  }
                  }>-</button>
                <span className="quantity-number">{quantity}</span>
                <button type="button" className="button increase-button" 
                  onClick={
                    () => {
                      changeQuantity("+");
                      changeTotalPrice();
                    }
                  }>+</button>
              </div>
            </div>
            <input className="submit-order-button" type="submit" value={"Add " + quantity + " to cart $" + totalPrice} />
          </form>
        </div>
      </div>
    </>
  )
}
  
  export default MenuItemPopup;