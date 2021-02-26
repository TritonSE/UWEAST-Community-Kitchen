import React, { Component } from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import LuxonUtils from '@date-io/luxon';
import '../css/CartSummary.css';
import { TextField } from '@material-ui/core';
import { Container, Row, Col, Button } from 'react-bootstrap';

class CartSummary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedDate: new Date(),
            subTotal: "00.00",
            tax: "00.00",
            totalPrice: "00.00",
            items: this.props.items
        }

        this.setSelectedDate = this.setSelectedDate.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.loadItems = this.loadItems.bind(this);
    }

    setSelectedDate = (date) => {
        this.setState({ selectedDate: date });
    }

    handleDateChange = (date) => {
        this.setSelectedDate(date);
    }

        //displays items currently in the cart and updates subtotal and total
        loadItems() {
            return(
                <div>
                    {this.state.items.map((item, ind) => {
    
                        this.state.subTotal = parseFloat(this.state.subTotal) + parseFloat(item.price);
                        this.state.subTotal = parseFloat(this.state.subTotal).toFixed(2);
                        this.state.totalPrice = parseFloat(this.state.subTotal) + parseFloat(this.state.tax);
                        this.state.totalPrice = parseFloat(this.state.totalPrice).toFixed(2);
    
                            return (
                                <div key={ind} className="summary-item row">
                                    <span className="thumbnail thumb-img">{ind+1}</span>
                                    <span className="item-info">{item.quantity} X {item.name}<br/>
                                    <span className="item-description">{item.description}</span></span>
                                    <button className="edit-button">Edit</button>
                                    <button className="remove-button">Remove</button>
                                    <span className="thumbnail summary-price">${item.price}</span>
                                    <span className="item-divider"></span>
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
                    <span>Choose Pickup Time</span>
                    <Row>
                    <form className="date-picker" noValidate>
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
                    </form>
                    </Row>
                    {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
       disableToolbar
       variant="inline"
       format="MM/dd/yyyy"
       margin="normal"
       id="date-picker-inline"
       label="Date picker inline"
       value={this.state.selectedDate}
       onChange={this.handleDateChange}
       KeyboardButtonProps = {{
         'aria-label': 'change date',
       }}
     />
     <KeyboardTimePicker
     disableToolbar
     variant="inline">

     </KeyboardTimePicker>
            </MuiPickersUtilsProvider> */}
                    <span className="summary-title">Order Summary</span>
                    <div className="fixed-scroll">
                            {/* loads and displays all items currently in the cart */}
                            {this.loadItems()}
                        </div>
                    <div className="order-totals">
                            <br/>
                            Subtotal: ${this.state.subTotal}<br/>
                            Tax: ${this.state.tax}<br/>
                            Total Price: ${this.state.totalPrice}
                        </div>
                    <Button className="return-button" onClick={this.props.toggleCart}>Return to Menu</Button>
                </div>
            </>
        )
    }
}

export default CartSummary;