import React, { useState } from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import moment from "moment";
import '../css/CartSummary.css';
import { Button } from 'react-bootstrap';
import CustomTimePicker from '../components/CustomTimePicker';
import { useCookies } from 'react-cookie';
import { useLocation, useHistory } from "react-router-dom";
import PayPal from '../components/PayPal';
import Navbar from '../components/NavBar';

//displays items currently in the cart and updates subtotal and total
function loadItems(cart, popupFunc, removeItem) {
    return (
        <div>
            {cart.items.map((item, ind) => {

                const popupValues = JSON.parse(item.popupValues);

                let accom = "";
                if(item.accommodations && Array.isArray(item.accommodations)) {
                    item.accommodations.forEach((accommodation) => {
                        accom = accom + ", " + accommodation;
                    })
                } else if(item.accommodations) {
                    accom = ", " + item.accommodations;
                }
                let size = item.size;

                let extraInfo = size + accom;

                const fillIns = {
                    quantity: item.quantity,
                    size: item.size,
                    instructions: item.instructions,
                    index: ind,
                    accommodations: item.accommodations
                }

                return (
                    <div key={ind} className="summary-item">
                        <div className="item-wrapper">
                            <span className="thumbnail-background thumb-image">{item.quantity}</span>
                            <span className="item-name">{popupValues.title}<br />
                                <span className="item-descript">{extraInfo}<br />
                                    {(item.instructions != "") ? <span>Special Instr.: {item.instructions}</span> : null}
                                </span></span>
                            <button className="edit-button" onClick={() => popupFunc(popupValues.title, popupValues.description, popupValues.price, popupValues.image, popupValues["dietary-info"], popupValues.accommodations, fillIns)}>Edit</button>
                            <button className="remove-button" onClick={() => removeItem(ind)}>Remove</button>
                            <span className="thumbnail-background summary-price">${item.price}</span>
                        </div>
                        <span className="item-divide"></span>
                    </div>
                )
            })}
        </div>
    )
}

export default function CartSummary(props) {
    const location = useLocation();
    let history = useHistory();
    const [cookies, setCookie] = useCookies(["cart"]);

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [isMobile, setIsMobile] = useState((window.innerWidth < 768) ? true : false);
    const [error, setError] = useState("");
    const [cart, setCart] = useState({
        cart_total: props.total || cookies.cart.total,
        item_total: props.subtotal || cookies.cart.subtotal,
        tax_total: props.tax || cookies.cart.tax,
        items: props.items || cookies.cart.items
    });

    // placeholder for rendering Paypal component until props handling is fixed in that component
    const [paypalCart, setPaypalCart] = useState({
        cart_total: "00.00",
        item_total: "00.00",
        tax_total: "00.00",
        items: [],
        pickup_date: ""
    });

    const styles = {
        size: {
            fontSize: 20
        }
    }

    const handleDateChange = (date) => {
        setSelectedDate(date);
    }
    const disableDates = (date) => {
        let currDate = new Date();
        const numDays = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0).getDate();
        return (currDate.getMonth() === date.getMonth() && date.getDate() - 3 < currDate.getDate()) || (currDate.getMonth() + 1 === date.getMonth() && date.getDate() < currDate.getDate() + 3 - numDays);
    }

    const handleRemove = (ind) => {
        let cart = cookies.cart;
        cart.subtotal = (parseFloat(cart.subtotal) - parseFloat(cart.items[ind].price)).toFixed(2);
        cart.tax = (parseFloat(cart.subtotal) * 0.0775).toFixed(2);
        cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.tax)).toFixed(2);
        cart.items.splice(ind, 1);
        setCookie("cart", cart, { path: "/" });
        const newCart = {
            cart_total: cart.total,
            item_total: cart.subtotal,
            tax_total: cart.tax,
            items: cart.items
        }
        setCart(newCart);
    }

    return (
        <div className="cart-wrapper">
            {(isMobile) ? <div className="navbar-wrapper">
                <Navbar />
            </div> : <div className="background" onClick={props.toggleCart}></div>}
            <div className="cart-popup">
                <span className="pickup-title">Choose Pickup Time</span>
                <div className="date-time">
                    <div className="date-picker">
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
                            {(!selectedDate || !selectedTime) ? <span className="select-error">Please select a date and a time</span> : null}
                        </MuiPickersUtilsProvider>
                    </div>
                    <CustomTimePicker
                        label="Time"
                        value={selectedTime}
                        setSelectedTime={(time) => {
                            const minTime = moment("7:59 AM", "HH:mm A");
                            const maxTime = moment("6:01 PM", "HH:mm A");
                            let errorMsg = "";
                            if (minTime.isBefore(time) && maxTime.isAfter(time)) {
                                setSelectedTime(time.format("HH:mm A"));
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
                    {(props.removeItem) ? loadItems(cart, props.popupFunc, props.removeItem) : loadItems(cart, props.popupFunc, handleRemove)}
                </div>
                <div className="order-totalprices">
                    <br />
                        Subtotal: ${cart.item_total}<br />
                        Tax: ${cart.tax_total}<br />
                        Total Price: ${cart.cart_total}
                </div>
                <div className="order-minimum">
                    {(parseFloat(cart.cart_total) < 20) ? <span>Order minimum is $20. Please add ${(20 - parseFloat(cart.cart_total)).toFixed(2)} to your cart to proceed to checkout.</span> : null}
                </div>
                <div className="return-button">
                    {(selectedTime && selectedDate && parseFloat(cart.cart_total) >= 20) ? <PayPal cart={paypalCart} /> : <Button className="return" onClick={(isMobile) ? () => history.push("/") : () => props.toggleCart()}>Return to Menu</Button>}
                </div>
            </div>
        </div>
    )
}