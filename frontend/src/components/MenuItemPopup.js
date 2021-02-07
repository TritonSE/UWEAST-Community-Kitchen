import React, { useState } from 'react';
import '../css/MenuItemPopup.css';

const MenuItemPopup = ({ values, togglePopup, processForm, dietaryInfo, priceOptions }) => {
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(parseInt(values.get("price")));
  const indvidualPrice = parseInt(values.get("price"));
  const familyPrice = parseInt(indvidualPrice);

  let currPrice = indvidualPrice;

  // handles changing price and quantity states
  const changeQuantity = sign => {
    if(sign == "+") {
      setQuantity(quantity + 1);
      // calulates on quantity + 1 b/c state hasn't updated yet
      setTotalPrice(currPrice * (quantity + 1));
    }
    else if(sign == "-") {
      if(quantity > 1) {
        setQuantity(quantity - 1);
        // calulates on quantity - 1 b/c state hasn't updated yet
        setTotalPrice(currPrice * (quantity - 1));
      }
    }
  }

  // will be used when family price is introduced to toggle between
  const changePrice = newPrice => {
    currPrice = newPrice;
  }

  return (
    <>
      {/** div that fades out the background */}
      <div className="greyout" onClick={togglePopup}></div>
      <div className="menu-item-popup">
        <span className="close-button" onClick={togglePopup}>+</span>
        <div className="left-popup">
          <img src={values.get("image")} />
        </div>
        <div className="right-popup">
          <form onSubmit={processForm} id="popup-form">
            <h2 className="title-popup">{values.get("title")}</h2>
            <h2 className="desc-popup">{values.get("description")}</h2>
            <p className="dietary-info">
              {/**
               * dietary info is an array list with 3 boolean values:
               * 1. vegan
               * 2. vegatarian
               * 3. gluten-free
               */}
            </p>
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
                <button type="button" className="button decrease-button" onClick={() => {changeQuantity("-");}
                  }>-</button>
                <span className="quantity-number">{quantity}</span>
                <button type="button" className="button increase-button" 
                  onClick={() => {changeQuantity("+");}}>+</button>
              </div>
            </div>
            <input name="name" type="hidden" value={values.get("title")} />
            <input name="price" type="hidden" value={totalPrice} />
            <input name="quantity" type="hidden" value={quantity} />
            <input className="submit-order-button" type="submit" value={"Add " + quantity + " to cart $" + totalPrice} />
          </form>
        </div>
      </div>
    </>
  )
}
  
  export default MenuItemPopup;