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
import React, { useState, useEffect, useCallback } from "react";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";

import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import "../css/CartSummary.css";
import { Button } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import CustomTimePicker from "./CustomTimePicker";
import PayPal from "./PayPal";
import Navbar from "./NavBar";
import MenuItemPopup from "./MenuItemPopup";
import {
  MIN_CART_TOTAL_CHECKOUT,
  MIN_PICKUP_ELAPSE_DAYS,
  ORDER_SERVICE_TAX_RATE,
  MIN_PICKUP_TIME,
  MAX_PICKUP_TIME,
} from "../util/constants.js";

const config = require("../config");

const BACKEND_URL = config.backend.uri;

const MIN_ORDER_ITEMS_FOR_PAYPAL_WARNING = 10;

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
        // checks if any accommodations were selected and adds them to be displayed
        let accom = "";
        if (item[6] && Array.isArray(item[6])) {
          item[6].forEach((accommodation) => {
            accom = `${accom}, ${accommodation}`;
          });
        } else if (item[6]) {
          accom = `, ${item[6]}`;
        }

        // item size and accommodations that need to be displayed
        const size = item[4];
        const extraInfo = size + accom;

        return (
          <div key={ind} className="summary-item">
            <div className="item-wrapper">
              <span className="thumbnail-background thumb-image">{ind + 1}</span>
              <span className="item-name">
                {item[3]} X {item[1]}
                <br />
                <span className="item-descript">
                  {extraInfo}
                  <br />

                  {/* Conditonally renders a new line with special instructions if any were added */}
                  {item[5] !== "" ? (
                    <div>
                      <br />
                      <span>Special Instr.: {item[5]}</span>
                    </div>
                  ) : null}
                </span>
              </span>

              {/* Opens MenuItemPopup to edit item details */}
              <button className="edit-button" onClick={() => popupFunc(item, ind)}>
                Edit
              </button>

              {/* Removes item from the cart */}
              <button className="remove-button" onClick={() => removeItem(ind)}>
                Remove
              </button>
              <span className="thumbnail-background summary-price">${item[2]}</span>
            </div>
            <span className="item-divide" />
          </div>
        );
      })}
    </div>
  );
}

/**
 * Renders the cart summary popup on deskopt/tablet and page on mobile
 *
 * @param {*} props - values passed down from parent component
 */
const CartSummary = (props) => {
  const history = useHistory();

  // time and date picker style
  const customTheme = createMuiTheme({
    palette: {
      primary: {
        main: "#f9ce1d",
      },
    },
    overrides: {
      MuiInputLabel: {
        root: {
          "&$focused": {
            color: "black",
          },
        },
      },
    },
  });

  // input field underline colors
  const useStyles = makeStyles({
    underline: {
      "&&&:before": {
        borderColor: "#000000",
      },
      "&&:after": {
        borderColor: "#f9ce1d",
      },
    },
  });

  const classes = useStyles();

  // font size for mobile
  const fontStyle = {
    style: {
      fontSize: "3vw",
    },
  };

  // stores cookie object and function to update cookie
  const [cookies, setCookie] = useCookies(["cart"]);

  // stores date that is selected
  const [selectedDate, setSelectedDate] = useState(null);

  // stored time that is selected
  const [selectedTime, setSelectedTime] = useState(null);

  // stores whether the window size is mobile or not
  const [isMobile] = useState(window.innerWidth < 768);

  // stores the error message for time picker
  const [error, setError] = useState("");

  // stores the cart object
  const [cart, setCart] = useState({
    total: props.total || (cookies.cart ? cookies.cart.total : "00.00"),
    subtotal: props.subtotal || (cookies.cart ? cookies.cart.subtotal : "00.00"),
    tax: props.tax || (cookies.cart ? cookies.cart.tax : "00.00"),
    items: props.items || (cookies.cart ? cookies.cart.items : []),
  });

  // stores whether or not the item popup is currently visible
  const [popupVisible, setPopupVisible] = useState(false);

  // map with all of the data that will be displayed in the item popup
  const [popupValues, setPopupValues] = useState(new Map());

  // key to update paypal component when state changes
  const [paypalKey, setPaypalKey] = useState(false);

  /**
   * updates item in cart to reflect changes made in item popup
   *
   * @param {*} item - edited item object to add to cart
   */
  const onItemEdit = (item) => {
    // check if cookies are disabled
    if (!navigator.cookieEnabled) {
      alert("Please enable your cookies and reload the page to use this website.");
      return;
    }

    // gets current cart object from cookies
    const { cart } = cookies;

    const popupValues = JSON.parse(item.popupValues);

    // create array representation of item object
    const newItem = [];
    newItem.push(
      popupValues.id,
      popupValues.title,
      item.price,
      item.quantity,
      item.size,
      item.instructions
    );
    if (item.accommodations) {
      newItem.push(item.accommodations);
    }

    // updates cart price values
    cart.subtotal = (
      parseFloat(cart.subtotal) -
      parseFloat(cart.items[popupValues.fillIns.index][2]) +
      parseFloat(item.price)
    ).toFixed(2);
    cart.tax = (parseFloat(cart.subtotal) * ORDER_SERVICE_TAX_RATE).toFixed(2);
    cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.tax)).toFixed(2);

    // replaces old item with edited item
    cart.items.splice(popupValues.fillIns.index, 1);
    cart.items.splice(popupValues.fillIns.index, 0, newItem);

    // updates cart cookie and state values to rerender page
    setCookie("cart", cart, { path: "/" });
    const newCart = {
      total: cart.total,
      subtotal: cart.subtotal,
      tax: cart.tax,
      items: cart.items,
    };
    setCart(newCart);

    // calls parent function to update its states
    if (!isMobile) {
      props.updateItems();
    }

    setPaypalKey(!paypalKey);
  };

  const editItem = (item, ind) => {
    // object to pass into item popup
    const fillIns = {
      quantity: item[3],
      size: item[4],
      instructions: item[5],
      index: ind,
      accommodations: item[6] ? item[6] : [],
    };

    // object to pass into fetch request
    const bodyObj = {
      _id: item[0],
    };

    // makes post request to get popup values of item
    fetch(`${BACKEND_URL}item/itemInfo`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(bodyObj),
    }).then(async (result) => {
      if (result.ok) {
        const json = await result.json();

        // displays item popup
        const popupValues = json.item;
        togglePopup(
          popupValues.Name,
          popupValues.Description,
          popupValues.Prices,
          popupValues.pictureURL,
          popupValues.dietaryInfo,
          popupValues.Accommodations,
          popupValues._id,
          fillIns
        );
      } else {
        console.log("error");
      }
    });
  };

  /**
   * processes the form submitted from the item popup
   *
   * @param {*} e - event object from form submission
   */
  const processForm = (e) => {
    // prevents page reload
    e.preventDefault();

    // gets the form data
    const data = new FormData(e.target);
    const object = {};

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
  };

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
  const togglePopup = (
    title,
    description,
    price,
    image,
    dietaryInfo,
    accommodations,
    id,
    fillIns
  ) => {
    // sets the values of the map based on passed-in information
    popupValues.set("title", title);
    popupValues.set("description", description);
    popupValues.set("price", price);
    popupValues.set("image", image);
    popupValues.set("dietary-info", dietaryInfo);
    popupValues.set("accommodations", accommodations);
    popupValues.set("id", id);
    popupValues.set("fillIns", fillIns);

    setPopupValues(popupValues);

    setPopupVisible(!popupVisible);
  };

  /**
   * updates selectedDate state to chosen date
   *
   * @param {*} date - Date object of chosen date
   */
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  /**
   * disables any invalid dates (less than 3 days from current date)
   *
   * @param {*} date - Date object of some arbitrary date
   */
  const disableDates = (date) => {
    const currDate = new Date();
    const numDays = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0).getDate();
    return (
      (currDate.getMonth() === date.getMonth() &&
        date.getDate() - MIN_PICKUP_ELAPSE_DAYS < currDate.getDate()) ||
      (currDate.getMonth() + 1 === date.getMonth() &&
        date.getDate() < currDate.getDate() + MIN_PICKUP_ELAPSE_DAYS - numDays)
    );
  };

  /**
   * Removes the item at index ind from the cart
   *
   * @param {*} ind - index of the item to be removed
   */
  const handleRemove = (ind) => {
    // check if cookies are disabled
    if (!navigator.cookieEnabled) {
      alert("Please enable your cookies and reload the page to use this website.");
      return;
    }

    // gets current cart object from cookies
    const { cart } = cookies;

    // modifies cart price values and removes item at index
    cart.subtotal = (parseFloat(cart.subtotal) - parseFloat(cart.items[ind][2])).toFixed(2);
    cart.tax = (parseFloat(cart.subtotal) * ORDER_SERVICE_TAX_RATE).toFixed(2);
    cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.tax)).toFixed(2);
    cart.items.splice(ind, 1);

    // updates cart cookie and state values to rerender page
    setCookie("cart", cart, { path: "/" });
    const newCart = {
      total: cart.total,
      subtotal: cart.subtotal,
      tax: cart.tax,
      items: cart.items,
    };
    setCart(newCart);
  };

  /**
   * Loads cart popup or page when window is resized
   */
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      history.push({
        pathname: "/",
        cartVisible: true,
      });
    }
    if (window.innerWidth < 768) {
      history.push("/cart");
    }
  };

  /**
   * Disables entire screen so user can't click or click out of anything. Used by PayPal Buttons.
   */
  const disableScreen = useCallback(() => {
    document.getElementById("cover").hidden = false;
  });

  /**
   * Enables entire screen so normal clicking functionality can be used. Used by PayPal Buttons.
   */
  const enableScreen = useCallback(() => {
    document.getElementById("cover").hidden = true;
  });

  /**
   * Adds event listener to load cart popup or page when window is resized
   */
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <div>
      {/* Renders item popup if an item is being edited */}
      {popupVisible ? (
        <MenuItemPopup values={popupValues} togglePopup={togglePopup} processForm={processForm} />
      ) : null}
      <div className="cart-wrapper">
        {/* Renders navbar if device is mobile */}
        {window.innerWidth < 768 ? (
          <Navbar itemCount={cart.items.length} />
        ) : (
          <div className="background" onClick={props.toggleCart} />
        )}
        <div className="cart-popup">
          <span className="pickup-title">Choose Pickup Time</span>
          <div className="date-time">
            <div className="date-picker">
              {/* Date picker to select a pickup date */}
              <MuiThemeProvider theme={customTheme}>
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
                    disablePast
                    shouldDisableDate={disableDates}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    InputProps={{ classes }}
                    inputProps={isMobile ? { fontStyle } : {}}
                    InputLabelProps={isMobile ? { fontStyle } : {}}
                  />
                  {!selectedDate || !selectedTime ? (
                    <p className="select-error">Please select a date and a time</p>
                  ) : null}
                </MuiPickersUtilsProvider>
              </MuiThemeProvider>
            </div>
            {/* Time picker to select a pickup time */}
            <CustomTimePicker
              label="Time"
              value={selectedTime}
              setSelectedTime={(time) => {
                const minTime = moment(MIN_PICKUP_TIME, "HH:mm A");
                const maxTime = moment(MAX_PICKUP_TIME, "HH:mm A");
                let errorMsg = "";
                if (minTime.isBefore(time) && maxTime.isAfter(time)) {
                  setSelectedTime(time.format("HH:mm A"));
                  errorMsg = false;
                } else {
                  errorMsg = `Select between ${MIN_PICKUP_TIME} and ${MAX_PICKUP_TIME}`;
                  setSelectedTime(null);
                }
                setError(errorMsg);
              }}
              setSize={isMobile}
              errorMessage={error}
              theme={customTheme}
              inpProps={{ classes }}
              fontProps={{ fontStyle }}
            />
          </div>
          <p className="pickup-date-info">
            NOTE: Earliest pickup is {MIN_PICKUP_ELAPSE_DAYS} days after order has been placed
          </p>
          <h1 className="summary-title">Order Summary</h1>
          <div className="cart-items">
            {/* loads and displays all items currently in the cart */}
            {props.removeItem
              ? loadItems(cart, editItem, props.removeItem)
              : loadItems(cart, editItem, handleRemove)}
          </div>
          <div className="order-totalprices">
            <br />
            Subtotal: ${cart.subtotal}
            <br />
            Tax: ${cart.tax}
            <br />
            Total Price: ${cart.total}
          </div>
          {/* Renders an error message if cart total is less than the $20 minimum */}
          <div className="order-minimum">
            {parseFloat(cart.total) < MIN_CART_TOTAL_CHECKOUT ? (
              <span>
                Order minimum is ${MIN_CART_TOTAL_CHECKOUT}. Please add $
                {(MIN_CART_TOTAL_CHECKOUT - parseFloat(cart.total)).toFixed(2)} to your cart to
                proceed to checkout.
              </span>
            ) : null}
          </div>
          {/* Renders PayPal component if all required fields are completed and return to menu button otherwise */}
          <div className="return-button">
            {selectedTime && selectedDate && parseFloat(cart.total) >= MIN_CART_TOTAL_CHECKOUT ? (
              <div>
                {cart.items.length >= MIN_ORDER_ITEMS_FOR_PAYPAL_WARNING ? (
                  <p className="slow-payment-note">
                    {" "}
                    <span style={{ color: "red" }}>NOTE:</span> Since your order contains many
                    items, it may take longer for the PayPal checkout to load. We recommend using
                    card instead for payment.
                  </p>
                ) : null}
                <PayPal
                  key={paypalKey}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  disableScreen={disableScreen}
                  enableScreen={enableScreen}
                />
              </div>
            ) : (
              <div>
                <style type="text/css">
                  {`
                            .btn-gold {
                                background-color: #f9ce1d;
                                border-color: #f9ce1d; 
                                color: #000000;
                            }
                            .btn-gold:hover{
                                background-color: #f0cb38;
                                border-color: #f0cb38;
                            }
                            `}
                </style>
                <Button
                  variant="gold"
                  onClick={isMobile ? () => history.push("/") : () => props.toggleCart()}
                  block
                >
                  Return to Menu
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* covers entire screen, disabling usage of all content if not hidden  */}
      <div
        id="cover"
        className=""
        style={{
          backgroundColor: "grey",
          opacity: "0",
          bottom: "0",
          left: "0",
          right: "0",
          top: "0",
          position: "fixed",
          zIndex: "100",
        }}
        hidden
      >
        {" "}
      </div>
    </div>
  );
};

export default CartSummary;
