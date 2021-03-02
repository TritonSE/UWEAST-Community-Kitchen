/**
 * Cart summary component that contains the entire checkout process. It renders the cart as a popup on
 * desktop/tablet and as a separate page on mobile, and includes a date and time picker, a list of the
 * items in the cart with the option to edit or remove each item, the total price, and the paypal
 * component to pay for the order. This file depends on the Navbar, PayPal, CustomTimePicker, and
 * MenuItemPopup components.
 * 
 * @summary Displays the cart and checkout process, with functionality to select pickup date/time and 
 * edit cart.
 * @author Dhanush Nanjunda Reddy
 */
import React, { useState, useEffect } from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import moment from "moment";
import '../css/CartSummary.css';
import { Button } from 'react-bootstrap';
import CustomTimePicker from '../components/CustomTimePicker';
import { useCookies } from 'react-cookie';
import { useHistory } from "react-router-dom";
import PayPal from '../components/PayPal';
import Navbar from '../components/NavBar';
import MenuItemPopup from '../components/MenuItemPopup';
import { isMobileOnly, withOrientationChange } from 'react-device-detect';

/**
 * displays items currently in the cart and updates subtotal, tax, and total
 * 
 * @param {*} cart - current cart object
 * @param {*} popupFunc - function to call to edit an item
 * @param {*} removeItem - function to call to remove an item
 * @returns {div} - a div that contains all items, one on each row
 */
function loadItems(cart, popupFunc, removeItem) {
    return (
        <div>
            {/* iterates through cart items and displays each in a row */}
            {cart.items.map((item, ind) => {

                const popupValues = JSON.parse(item.popupValues);

                //checks if any accommodations were selected and adds them to be displayed
                let accom = "";
                if (item.accommodations && Array.isArray(item.accommodations)) {
                    item.accommodations.forEach((accommodation) => {
                        accom = accom + ", " + accommodation;
                    })
                } else if (item.accommodations) {
                    accom = ", " + item.accommodations;
                }

                //item size and accommodations that need to be displayed
                let size = item.size;
                let extraInfo = size + accom;

                //object to be passed in to MenuItemPopup when edit button is clicked
                const fillIns = {
                    quantity: item.quantity,
                    size: item.size,
                    instructions: item.instructions,
                    index: ind,
                    accommodations: item.accommodations ? item.accommodations : []
                }


                return (
                    <div key={ind} className="summary-item">
                        <div className="item-wrapper">
                            <span className="thumbnail-background thumb-image">{ind + 1}</span>
                            <span className="item-name">{item.quantity} X {popupValues.title}<br />
                                <span className="item-descript">{extraInfo}<br />

                                    {/* Conditonally renders a new line with special instructions if any were added */}
                                    {(item.instructions !== "") ? <div><br /><span>Special Instr.: {item.instructions}</span></div> : null}
                                </span></span>

                            {/* Opens MenuItemPopup to edit item details */}
                            <button className="edit-button" onClick={() => popupFunc(popupValues.title, popupValues.description, popupValues.price, popupValues.image, popupValues["dietary-info"], popupValues.accommodations, fillIns)}>Edit</button>

                            {/* Removes item from the cart */}
                            <button className="remove-button" onClick={() => removeItem(ind)}>Remove</button>
                            <span className="thumbnail-background summary-price">${cart.itemPrices[ind].price}</span>
                        </div>
                        <span className="item-divide"></span>
                    </div>
                )
            })}
        </div>
    )
}

/**
 * Renders the cart summary popup on deskopt/tablet and page on mobile
 * 
 * @param {*} props - values passed down from parent component
 */
const CartSummary = (props) => {
    let history = useHistory();
    const { isLandscape } = props

    //stores cookie object and function to update cookie
    const [cookies, setCookie] = useCookies(["cart"]);

    //stores date that is selected
    const [selectedDate, setSelectedDate] = useState(null);

    //stored time that is selected
    const [selectedTime, setSelectedTime] = useState(null);

    //stores time object to pass to PayPal component
    const [cartTime, setCartTime] = useState(null);

    //stores whether the window size is mobile or not
    const [isMobile, setIsMobile] = useState((window.innerWidth < 768) ? true : false);

    //stores the error message for time picker
    const [error, setError] = useState("");

    //stores the cart object
    const [cart, setCart] = useState({
        cart_total: props.total || cookies.cart.total,
        item_total: props.subtotal || cookies.cart.subtotal,
        tax_total: props.tax || cookies.cart.tax,
        items: props.items || JSON.parse(localStorage.getItem('cartItems')),
        itemPrices: props.itemPrices || cookies.cart.prices
    });

    // stores whether or not the item popup is currently visible
    const [popupVisible, setPopupVisible] = useState(false);

    // map with all of the data that will be displayed in the item popup
    const [popupValues, setPopupValues] = useState(new Map());

    // placeholder for rendering Paypal component until props handling is fixed in that component
    const [paypalCart, setPaypalCart] = useState({
        cart_total: "00.00",
        item_total: "00.00",
        tax_total: "00.00",
        items: [],
        pickup_date: ""
    });

    /**
     * updates item in cart to reflect changes made in item popup
     * 
     * @param {*} item - edited item object to add to cart
     */
    const onItemEdit = (item) => {
        //gets current cart object from cookies
        let cart = cookies.cart;

        const itemCost = item.price;

        delete item.price;

        const popupValues = JSON.parse(item.popupValues);

        //replaced old item with edited item and updates totals
        let currItems = JSON.parse(localStorage.getItem('cartItems'));
        currItems.splice(popupValues.fillIns.index, 1);
        currItems.splice(popupValues.fillIns.index, 0, item);
        localStorage.setItem('cartItems', JSON.stringify(currItems));

        cart.subtotal = (parseFloat(cart.subtotal) - parseFloat(cart.prices[popupValues.fillIns.index].price) + parseFloat(itemCost)).toFixed(2);
        cart.tax = (parseFloat(cart.subtotal) * 0.0775).toFixed(2);
        cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.tax)).toFixed(2);

        const newPrices = {
            price: itemCost,
            individual_tax: (parseFloat(itemCost) * 0.0775).toFixed(2)
        }

        cart.prices[popupValues.fillIns.index] = newPrices;

        //updates cart cookie and state values to rerender page
        setCookie("cart", cart, { path: "/" });
        const newCart = {
            cart_total: cart.total,
            item_total: cart.subtotal,
            tax_total: cart.tax,
            items: currItems,
            itemPrices: cart.prices
        }
        setCart(newCart);

        //calls parent function to update its states
        if (!isMobile) {
            props.updateItems();
        }
    }

    /**
     * processes the form submitted from the item popup
     * 
     * @param {*} e - event object from form submission
     */
    const processForm = e => {
        // prevents page reload
        e.preventDefault();

        // gets the form data
        var data = new FormData(e.target);
        var object = {};

        // goes through and makes an object from the FormData
        data.forEach((value, key) => {
            if (!Reflect.has(object, key)) {
                object[key] = value;
                return;
            }

            if (!Array.isArray(object[key])) {
                object[key] = [object[key]];
            }
            object[key].push(value);
        });

        // calls function to add item from item popup to cart
        onItemEdit(object);

        // when submit button is clicked, the popup is closed
        togglePopup();
    }

    /**
     * closes item popup when open and opens popup when closed
     * 
     * @param {*} title - name of the item
     * @param {*} description - item description
     * @param {*} price - item price
     * @param {*} image - item image
     * @param {*} dietaryInfo - dietary info for the item
     * @param {*} accommodations - accommodation options for the item
     * @param {*} fillIns - already selected values for this item
     */
    const togglePopup = (title, description, price, image, dietaryInfo, accommodations, fillIns) => {
        setPopupVisible(!popupVisible);

        // sets the values of the map based on passed-in information
        popupValues.set("title", title);
        popupValues.set("description", description);
        popupValues.set("price", price);
        popupValues.set("image", image);
        popupValues.set("dietary-info", dietaryInfo);
        popupValues.set("accommodations", accommodations);
        popupValues.set("fillIns", fillIns);

        setPopupValues(popupValues);
    }

    /**
     * updates selectedDate state to chosen date
     * 
     * @param {*} date - Date object of chosen date
     */
    const handleDateChange = (date) => {
        setSelectedDate(date);
    }

    /**
     * disables any invalid dates (less than 3 days from current date)
     * 
     * @param {*} date - Date object of some arbitrary date
     */
    const disableDates = (date) => {
        let currDate = new Date();
        const numDays = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0).getDate();
        return (currDate.getMonth() === date.getMonth() && date.getDate() - 3 < currDate.getDate()) || (currDate.getMonth() + 1 === date.getMonth() && date.getDate() < currDate.getDate() + 3 - numDays);
    }

    /**
     * Removes the item at index ind from the cart
     * 
     * @param {*} ind - index of the item to be removed 
     */
    const handleRemove = (ind) => {
        //gets current cart object from cookies
        let cart = cookies.cart;

        let currItems = JSON.parse(localStorage.getItem('cartItems'));
        currItems.splice(ind, 1);
        localStorage.setItem('cartItems', JSON.stringify(currItems));

        //modifies cart object values to remove the item at index ind
        cart.subtotal = (parseFloat(cart.subtotal) - parseFloat(cart.prices[ind].price)).toFixed(2);
        cart.tax = (parseFloat(cart.subtotal) * 0.0775).toFixed(2);
        cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.tax)).toFixed(2);
        cart.prices.splice(ind, 1);

        //updates cart cookie and state values to rerender page
        setCookie("cart", cart, { path: "/" });
        const newCart = {
            cart_total: cart.total,
            item_total: cart.subtotal,
            tax_total: cart.tax,
            items: currItems,
            itemPrices: cart.prices
        }
        setCart(newCart);
    }

    /**
     * Loads cart page if window size is mobile 
     */
    useEffect(() => {
        // if (isMobileOnly && isLandscape) {
        //     history.push("/cart");
        // }
        window.addEventListener('resize', function () {
            // if(isLandscape && window.innerHeight < 768) {
            //     history.push("/cart");
            // }
            if (window.innerWidth >= 768  && window.innerHeight >= 768) {
                history.push({
                    pathname: "/",
                    cartVisible: true,
                });
            }
            if (window.innerWidth < 768) {
                history.push("/cart");
            }
        });
        // window.addEventListener('orientationchange', function (event) {
        //     if(event.target.screen.orientation.angle === -90) {
        //         history.push("/cart");
        //     }
        // })
    })

    return (
        <div>
            {/* Renders item popup if an item is being edited */}
            {popupVisible ? <MenuItemPopup values={popupValues} togglePopup={togglePopup} processForm={processForm} /> : null}
            <div className="cart-wrapper">
                {(window.innerWidth < 768 || (window.innerHeight < 768 && isLandscape)) ? <div className="navbar-wrapper">
                    <Navbar />
                </div> : <div className="background" onClick={props.toggleCart}></div>}
                <div className="cart-popup">
                    <span className="pickup-title">Choose Pickup Time</span>
                    <div className="date-time">
                        <div className="date-picker">
                            {/* Date picker to select a pickup date */}
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    disablePast={true}
                                    shouldDisableDate={disableDates}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    inputProps={
                                        isMobile ?
                                            {
                                                style: {
                                                    fontSize: "3vw"
                                                }
                                            } : {}}
                                    InputLabelProps={
                                        isMobile ?
                                            {
                                                style: {
                                                    fontSize: "3vw"
                                                }
                                            } : {}}
                                />
                                {(!selectedDate || !selectedTime) ? <p className="select-error">Please select a date and a time</p> : null}
                            </MuiPickersUtilsProvider>
                        </div>
                        {/* Time picker to select a pickup time */}
                        <CustomTimePicker
                            label="Time"
                            value={selectedTime}
                            setSelectedTime={(time) => {
                                const minTime = moment("7:59 AM", "HH:mm A");
                                const maxTime = moment("6:01 PM", "HH:mm A");
                                let errorMsg = "";
                                if (minTime.isBefore(time) && maxTime.isAfter(time)) {
                                    setSelectedTime(time.format("HH:mm A"));
                                    setCartTime(time.format("HH:mm:ss"));
                                    errorMsg = false;
                                } else {
                                    errorMsg = "Select between 8:00 AM and 6:00 PM";
                                }
                                setError(errorMsg);
                            }}
                            setSize={isMobile}
                            errorMessage={error}
                        />
                    </div>
                    <p className="pickup-date-info">NOTE: Earliest pickup is 3 days after order has been placed</p>
                    <h1 className="summary-title">Order Summary</h1>
                    <div className="cart-items">
                        {/* loads and displays all items currently in the cart */}
                        {(props.removeItem) ? loadItems(cart, togglePopup, props.removeItem) : loadItems(cart, togglePopup, handleRemove)}
                    </div>
                    <div className="order-totalprices">
                        <br />
                        Subtotal: ${cart.item_total}<br />
                        Tax: ${cart.tax_total}<br />
                        Total Price: ${cart.cart_total}
                    </div>
                    {/* Renders an error message if cart total is less than the $20 minimum */}
                    <div className="order-minimum">
                        {(parseFloat(cart.cart_total) < 20) ? <span>Order minimum is $20. Please add ${(20 - parseFloat(cart.cart_total)).toFixed(2)} to your cart to proceed to checkout.</span> : null}
                    </div>
                    {/* Renders PayPal component if all required fields are completed and return to menu button otherwise */}
                    <div className="return-button">
                        {(selectedTime && selectedDate && parseFloat(cart.cart_total) >= 20) ? <PayPal cart={paypalCart} /> : <Button style={{ backgroundColor: "#f9ce1d", borderColor: "#f9ce1d", color: "#000000" }} className="return" onClick={(isMobile) ? () => history.push("/") : () => props.toggleCart()}>Return to Menu</Button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withOrientationChange(CartSummary);