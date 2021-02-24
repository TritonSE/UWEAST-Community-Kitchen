/**
 * Popup that displays specified item when MenuItem is clicked. Has form to 
 * pass data to/add items to cart. Popup gives relevant information such as 
 * pricing, description, additional accommodations etc.
 * 
 * @summary     Displays item information and allows user to add item to cart.
 * @author      Aaron Kirk, Navid Boloorian
 */

import React, { useState } from 'react';
import '../css/MenuItemPopup.css';
import plus from '../media/plus.svg';
import minus from '../media/minus.svg';

const MenuItemPopup = ({ values, togglePopup, processForm }) => {

    /**
     * Calculates the initial cost to add on from default selected accommodations
     * when editing an item (when auto-selecting fields). Must be used first to
     * set the inital totalPrice state when editing items.
     * 
     * @returns {number} - Sum of the price of all auto-selected accommodations
     */
    const getInitialAccommodationsCost = () => {
        var sum = 0;
        if(values.get("fillIns") != undefined) {
            values.get("accommodations").forEach((accommodation) => {
                if(values.get("fillIns").accommodations.includes(accommodation.Description)) {
                    sum += parseFloat(accommodation.Price).toFixed(2);
                }
            });
        }
        return sum;
    }

    // TODO: fix the absurd tertiary statements here...
    const [quantity, setQuantity] = useState((values.get("fillIns") != undefined) ? parseInt(values.get("fillIns").quantity) : 1);
    // if individual price exists, use that as default; otherwise, use family
    const [currPrice, setCurrPrice] = useState((values.get("fillIns") != undefined) ? ((values.get("fillIns").size == "Individual") ? values.get("price").Individual : values.get("price").Family) : (("Individual" in values.get("price")) ? values.get("price").Individual : values.get("price").Family));
    const [accommodationCost, setAccommodationCost] = useState(getInitialAccommodationsCost());
    const [totalPrice, setTotalPrice] = useState((parseFloat(currPrice * quantity) + parseFloat(accommodationCost)).toFixed(2));

    /**
     * Updates the quantity and price states accordingly when the user tries to
     * increment or decrement the quantity.
     * 
     * @param {*} sign - Symbol (+ or -) indicating whether to increase or decrease quantity
     */
    const changeQuantity = sign => {
        // two scenarios: increments or decrements quantity
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

    /**
     * Updates price when accommodations are selected or unselected.
     * 
     * @param {*} checked - Checked state of the accommodation field 
     * @param {*} price - Price of the accommodation to be added or removed
     */
    const handleAccommodation = (checked, price) => {
        // adds price if field is now checked; removes price otherwise
        if(checked) {
            // parseFloat() is necessary because otherwise they get treated like strings for addition
            setAccommodationCost((parseFloat(accommodationCost) + parseFloat(price)).toFixed(2));
            setTotalPrice((parseFloat(totalPrice) + parseFloat(price)).toFixed(2));
        } else {
            setAccommodationCost((accommodationCost - price).toFixed(2));
            setTotalPrice((totalPrice - price).toFixed(2));
        }
    }

    /**
     * Helper function to render a sizing option and determine whether or not
     * it should be checked by default.
     * 
     * @param {*} name - Name of Size (Individual or Family)
     * @param {*} price - Price of Size
     * @param {*} hasBothPrices - boolean indicating whether both options are being rendered in order to choose default selection
     */
    const renderSize = (name, price, hasBothPrices) => {
        return(
            // conditionally displays family size as an "add-on" if both are possible
            // TODO: fix the absurd nested tertiary statements
            //      (these decide whether the element should be checked by default
            //       depending on which size this is, whether both sizes are 
            //       available, and whether an item is passed in to fill populate fields)
            <label className="choice-label">
                <input onClick={() => handleSize(price)} type="radio" name="size" value={name} defaultChecked={(name == "Individual" || ((values.get("fillIns") != undefined) && values.get("fillIns").size == name) || !("Individual" in values.get("price")))} required />
                <span onClick={() => handleSize(price)} className="label-title">{(hasBothPrices) ? name + " +($" + parseFloat(price - values.get("price").Individual).toFixed(2) + ")": name}</span>
            </label>
        );
    }
    
    /**
     * Changes price depending on the size selected.
     * 
     * @param {*} newPrice - Price of the newly selected size
     */
    const handleSize = (newPrice) => {
        setCurrPrice(newPrice);
        // currPrice has yet to update, so still using newPrice
        // fix to 2 decimal places
        setTotalPrice((parseFloat(accommodationCost) + newPrice * (quantity)).toFixed(2));
    }

    /**
     * Helper function to render the entire accommodations section.
     */
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

                            <input type="checkbox" name="accommodations" 
                                defaultChecked={values.get("fillIns") != undefined && values.get("fillIns").accommodations.includes(accommodation.Description)}
                                value={accommodation.Description} id={accommodation.Description} onChange={(e) => handleAccommodation(e.target.checked, accommodation.Price)} />

                            <span className="label-title">{accommodation.Description + " +($" + parseFloat(accommodation.Price).toFixed(2) + ")"}</span>
                        </label>
                    );
                })}
                </div>
            );
        }
    }

    /**
     * Helper function to count number of dietary information.
     * 
     * @returns {number} - Number of dietary information fields that are true for this item.
     */
    const numDietaryInfo = () => {
        // convert to Object
        const dietaryInfo = Object.entries(values.get("dietary-info"));
        var count = 0;
        // loop through all the dietaryInfo and account for ones that are true
        for (const [key, value] of dietaryInfo) {
            if(value) count++;
        }
        return count;
    }

    /**
     * Helper function to render all the dietary information
     */
    const renderDietaryInfo = () => {
        // returns nothing in the trivial case that there is no information to show
        // this is so that the horizontal line (<hr/>) will not render
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
                    {(values.get("dietary-info").glutenFree) ? <br/> : null}
                    {(values.get("dietary-info").containsDairy) ? "*Contains Dairy" : null}
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
                        <div className="popup-image" style={{backgroundImage: "url(" + values.get("image") + ")", backgroundSize:"cover"}}>
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
                                <textarea name="instructions" maxLength="75" className="instructions-textarea">{(values.get("fillIns") != undefined) ? values.get("fillIns").instructions : ""}</textarea>
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
                            <input name="popupValues" type="hidden" value={values} />
                            <input name="price" type="hidden" value={parseFloat(totalPrice).toFixed(2)} />
                            <input name="quantity" type="hidden" value={quantity} />
                            <input className="submit-order-button" type="submit" value={(values.get("fillIns") != undefined) ? "Save Changes: $" + totalPrice : "Add " + quantity + " to cart: $" + totalPrice} />
                        </form>
                    </div>

                </div>
            </div>
        </>
    )
}
  
    export default MenuItemPopup;
