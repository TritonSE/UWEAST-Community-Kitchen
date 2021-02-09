import React, { useState } from 'react';
import '../css/MenuItemPopup.css';
import plus from '../media/plus.svg';
import minus from '../media/minus.svg';

const MenuItemPopup = ({ values, togglePopup, processForm }) => {
    const [quantity, setQuantity] = useState(1);
    // if individual price exists, use that as default; otherwise, use family
    const [currPrice, setCurrPrice] = useState(("Individual" in values.get("price")) ? values.get("price").Individual : values.get("price").Family);
    const [totalPrice, setTotalPrice] = useState(currPrice);
    const [accommodationCost, setAccommodationCost] = useState(0);

    // handles changing price and quantity states
    const changeQuantity = sign => {
        // everything is fixed to 2 decimal places
        if(sign == "+") {
            setQuantity(quantity + 1);
            // calulates on quantity + 1 b/c state hasn't updated yet
            setTotalPrice((parseFloat(accommodationCost) + currPrice * (quantity + 1)).toFixed(2));
        }
        else if(sign == "-") {
            if(quantity > 1) {
                setQuantity(quantity - 1);
                // calulates on quantity - 1 b/c state hasn't updated yet
                setTotalPrice((parseFloat(accommodationCost) + currPrice * (quantity - 1)).toFixed(2));
            }
        }
    }

    //handles toggling price additions from accommodations
    const handleAccommodation = (event, price) => {
        // everything is fixed to 2 decimal places
        if(event.target.checked) {
            // parseFloat() is necessary because otherwise they get treated like strings for addition
            setAccommodationCost((parseFloat(accommodationCost) + parseFloat(price)).toFixed(2));
            setTotalPrice((parseFloat(totalPrice) + parseFloat(price)).toFixed(2));
        } else {
            setAccommodationCost((accommodationCost - price).toFixed(2));
            setTotalPrice((totalPrice - price).toFixed(2));
        }
    }

    // helper function to render the 
    const renderSize = (name, price, hasBothPrices) => {
        return(
            /** conditionally displays family size as an "add-on" if both are possible */
            <label className="choice-label">
                <input onClick={() => handleSize(price)} type="radio" name="size" value={name} defaultChecked={(name == "Individual" || !("Individual" in values.get("price")))} required />
                <span onClick={() => handleSize(price)} className="label-title">{(hasBothPrices) ? name + " +($" + parseFloat(price - values.get("price").Individual).toFixed(2) + ")": name}</span>
            </label>
        );
    }
    // will be used when family price is introduced to toggle between
    const handleSize = (newPrice) => {
        setCurrPrice(newPrice);
        // currPrice has yet to update, so still using newPrice
        // fix to 2 decimal places
        setTotalPrice((parseFloat(accommodationCost) + newPrice * (quantity)).toFixed(2));
    }

    const renderAccommodations = () => {
        // return nothing if there are no accommodations
        if(values.get("accommodations").length == 0) return;
        else {
            return (
                /** Header */
                <div className="section accommodations-section">
                <div className="section-title">
                    <h3>Accommodations</h3>
                    <i>optional</i>
                </div>
                {/* map through and render all accommodations */}
                {values.get("accommodations").map((accommodation) => {
                    return(
                        <label className="choice-label">
                            <input type="checkbox" name="accommodations" value={accommodation.Description} id={accommodation.Description} onChange={(e) => handleAccommodation(e, accommodation.Price)} />
                            <span className="label-title">{accommodation.Description + " +($" + parseFloat(accommodation.Price).toFixed(2) + ")"}</span>
                        </label>
                    );
                })}
                </div>
            );
        }
    }

    const numDietaryInfo = () => {
        const dietaryInfo = Object.entries(values.get("dietary-info"));
        var count = 0;
        for (const [key, value] of dietaryInfo) {
            if(value) count++;
        }
        return count;
    }

    const renderDietaryInfo = () => {
        if (numDietaryInfo() == 0) return;
        else {
            return (
                <>
                <hr/>
                <p className="dietary-info">
                    {(values.get("dietary-info").vegan) ? "*Vegan" : null}
                    {(values.get("dietary-info").vegan) ? <br/> : null}
                    {(values.get("dietary-info").vegetarian) ? "*Vegetarian" : null}
                    {(values.get("dietary-info").vegetarian) ? <br/> : null}
                    {(values.get("dietary-info").glutenFree) ? "*Gluten-free" : null}
                </p>
                </>
            );
        }
    }

    return (
        <>
            {/** div that fades out the background */}
            <div className="greyout" onClick={togglePopup}></div>
            <div className="menu-item-popup">
                <span className="close-button" onClick={togglePopup}>+</span>
                <div className="group-popup">

                    {/** Left side with dish details */}
                    <div className="left-popup">
                        <div className="popup-image" style={{backgroundImage: "url(" + values.get("image") + ")"}}>
                            <div className="popup-image-price"><h3>{"$" + parseFloat(currPrice).toFixed(2)}</h3></div>
                        </div>
                        <div className="popup-item-info">
                            <h3 className="title-popup">{values.get("title")}</h3>
                            <p className="desc-popup">{values.get("description")}</p>
                            {renderDietaryInfo()}
                        </div>
                    </div>

                    {/** right side with order options */}
                    <div className="right-popup">
                        <form onSubmit={processForm} id="popup-form">

                            {/** sizing options */}
                            <div className="section size-section">
                                <div className="section-title">
                                    <h3>Choose Size</h3>
                                    <i>required</i>
                                </div>
                                {/** checks to ensure individual/family sizes exist; conditionally displays family size as an "add-on" if both are possible */}
                                {("Individual" in values.get("price")) ? renderSize("Individual", values.get("price").Individual, false) : null}
                                {("Family" in values.get("price")) ? renderSize("Family", values.get("price").Family, ("Individual" in values.get("price"))) : null}
                            </div>

                            {/** accommodations options */}
                            {renderAccommodations()}

                            {/** custom instructions text area */}
                            <div className="section instructions-section">
                                <div className="section-title">
                                    <h3>Special Instructions</h3>
                                    <i>optional</i>
                                </div>
                                <p className="instructions-note">Special accommodations can be made for orders placed in advanced but are not guaranteed, please <a href="/contact">contact us</a> directly for more info.</p>
                                <textarea name="instructions" maxLength="75" className="instructions-textarea" />
                            </div>

                            {/** quantity selection */}
                            <div className="section quantity-section">
                                <div className="section-title"><h3>Quantity</h3></div>
                                <div className="quantity-buttons">
                                    <button type="button" className="button decrease-button" onClick={() => {changeQuantity("-");}
                                    }><img src={minus} alt="Decrease Quantity" /></button>
                                    <span className="quantity-number">{quantity}</span>
                                    <button type="button" className="button increase-button" 
                                    onClick={() => {changeQuantity("+");}}><img src={plus} alt="Increase Quantity" /></button>
                                </div>
                            </div>

                            {/** hidden fields to pass along to the total price and  quantity */}
                            <input name="name" type="hidden" value={values.get("title")} />
                            <input name="price" type="hidden" value={parseFloat(totalPrice).toFixed(2)} />
                            <input name="quantity" type="hidden" value={quantity} />
                            <input className="submit-order-button" type="submit" value={"Add " + quantity + " to cart: $" + totalPrice} />
                        </form>
                    </div>

                </div>
            </div>
        </>
    )
}
  
    export default MenuItemPopup;