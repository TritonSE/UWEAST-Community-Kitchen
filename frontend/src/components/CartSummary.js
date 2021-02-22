import React, { Component } from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { KeyboardDatePicker, KeyboardTimePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import LuxonUtils from '@date-io/luxon';
import moment from "moment";
import '../css/CartSummary.css';
import { TextField } from '@material-ui/core';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CustomTimePicker from '../components/CustomTimePicker';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import PayPal from '../components/PayPal';

class CartSummary extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            cart: {
                cart_total: "00.00",
                item_total: "00.00",
                tax_total: "00.00",
                items: []
            },
            selectedDate: null,
            selectedTime: null,
            subTotal: this.props.subtotal,
            tax: this.props.tax,
            totalPrice: this.props.total,
            items: this.props.items,
            error: "",
            displayPayPal: false
        }

        this.setSelectedDate = this.setSelectedDate.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.loadItems = this.loadItems.bind(this);
        //this.reloadData = this.reloadData.bind(this);
    }

    setSelectedDate = (date) => {
        this.setState({ selectedDate: date });
    }

    handleDateChange = (date) => {
        this.setSelectedDate(date);
    }

    disableDates = (date) => {
        let currDate = new Date();
        const numDays = new Date(currDate.getFullYear(), currDate.getMonth()+1, 0).getDate();
        return (currDate.getMonth() == date.getMonth() && date.getDate() - 3 < currDate.getDate()) || (currDate.getMonth()+1 == date.getMonth() && date.getDate() <  currDate.getDate()+3-numDays);
    }

    //displays items currently in the cart and updates subtotal and total
    loadItems() {
        return (
            <div>
                {this.state.items.map((item, ind) => {

                    let accomodation = (item.accommodations) ? ", " + item.accommodations : "";
                    let size = item.size;

                    let extraInfo = size + accomodation;

                    if(this.state.selectedTime && this.state.selectedDate && parseFloat(this.state.totalPrice) > 20) {
                        this.state.displayPayPal = true;
                    } else {
                        this.state.displayPayPal = false;
                    }

                    return (
                        <div key={ind} className="summary-item row">
                            <span className="thumbnail-background thumb-img">{item.quantity}</span>
                            <span className="item-name">{item.name}<br />
                                <span className="item-descript">{extraInfo}<br/>
                                {(item.instructions != "") ? <span>Special Instr.: {item.instructions}</span> : null}
                                </span></span>
                            <button className="edit-button">Edit</button>
                            <button className="remove-button" onClick={() => this.props.removeItem(ind) }>Remove</button>
                            <span className="thumbnail-background summary-price">${item.price}</span>
                            <span className="item-divide"></span>
                        </div>
                    )
                })}
            </div>
        )
    }

    render() {
        return (
            <>
                <div className="background" onClick={this.props.toggleCart}></div>
                <div className="cart-popup">
                    <br />
                    <span className="pickup-title">Choose Pickup Time</span>
                    <Row>
                        {/* <form className="date-picker" noValidate>
                            <TextField
                                id="date"
                                label="Date"
                                type="date"
                                defaultValue={new Date()}
                                className="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>
                        <form className="time-picker" noValidate>
                            <TextField
                                id="time"
                                label="Time"
                                type="time"
                                defaultValue={null}
                                className="time"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    step: 300, // 5 min
                                }}
                            />
                        </form> */}
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <div className="date-picker">
                            <Row>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="Date"
                                value={this.state.selectedDate}
                                onChange={this.handleDateChange}
                                disablePast={true}
                                shouldDisableDate={this.disableDates}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            </Row>
                            <Row>
                            {(!this.state.selectedDate || !this.state.selectedTime) ? <span className="select-error">Please select a date and a time</span> : null}
                            </Row>
                            </div>
                            </MuiPickersUtilsProvider>
                          
                            <CustomTimePicker
                                label="Time"
                                value={this.state.selectedTime}
                                setSelectedTime={(time) => {
                                    const minTime = moment("7:59 AM", "HH:mm A");
                                    const maxTime = moment("6:01 PM", "HH:mm A");
                                    let errorMsg = "";
                                    if (minTime.isBefore(time) && maxTime.isAfter(time)) {
                                        this.state.selectedTime = time.format("HH:mm A");
                                        errorMsg = false;
                                    } else {
                                        errorMsg = "Select between 8:00 AM and 6:00 PM";
                                    }
                                    this.setState({ error: errorMsg });
                                }}
                                errorMessage={this.state.error}
                            />
                          
                    </Row>
                    <p className="pickup-date-info">NOTE: Earliest pickup is 3 days after order has been placed</p>
                    <h1 className="summary-title">Order Summary</h1>
                    <div className="cart-items">
                        {/* loads and displays all items currently in the cart */}
                        {this.loadItems()}
                    </div>
                    <div className="order-totalprices">
                        <br />
                            Subtotal: ${this.state.subTotal}<br />
                            Tax: ${this.state.tax}<br />
                            Total Price: ${this.state.totalPrice}
                    </div>
                    <div className="order-minimum">
                    {(parseFloat(this.state.totalPrice) < 20) ? <span>Order minimum is $20. Please add ${(20 - parseFloat(this.state.totalPrice)).toFixed(2)} to your cart to proceed to checkout.</span> : null}
                    </div>
                    <div className="return-button">
                    {(this.state.displayPayPal) ? <PayPal cart={this.state.cart}/>: <Button className="return" onClick={this.props.toggleCart}>Return to Menu</Button>}
                    </div>
                </div>
            </>
        )
    }
}

export default withCookies(CartSummary);