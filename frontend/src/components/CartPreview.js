/**
 * Cart preview component that displays the items currently in the cart. It renders the items in the
 * cart, with each item's name, quantity, size, accommodations (if any), special instructions (if any), 
 * and price. It also renders a button that opens the cart summary. This file has no dependencies on 
 * other files or components.
 * 
 * @summary Displays the cart preview on desktop in the bottom-right corner of the screen.
 * @author Dhanush Nanjunda Reddy
 */
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import '../css/CartPreview.css';

class CartPreview extends Component {

    constructor(props) {
        super(props);
        this.state = {

            //stores items in the cart
            items: this.props.items,

            itemPrices: this.props.itemPrices,

            //stores subtotal of items in the cart
            subTotal: this.props.subtotal,

            //stores total tax for items in the cart
            tax: this.props.tax,

            //stores total price of items in the cart
            totalPrice: this.props.total
        }

        this.loadItems = this.loadItems.bind(this);
    }

    /**
     * displays items currently in the cart and updates subtotal, tax, and total
     * 
     * @returns {div} - a div that contains all items, one on each row
     */
    loadItems() {
        return (
            <div>
                {/* iterates through items array and displays each in a row */}
                {this.state.items.map((item, ind) => {

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

                    return (
                        <div key={ind} className="summary-item row">
                            <span className="thumbnail thumb-img">{ind + 1}</span>
                            <span className="item-info">{item.quantity} X {popupValues.title}<br />
                                <span className="item-description">{extraInfo}<br />
                                    {/* Conditonally renders a new line with special instructions if any were added */}
                                    {(item.instructions !== "") ? <div><br /><span>Special Instr.: {item.instructions}</span></div> : null}
                                </span></span>
                            <span className="thumbnail summary-price">${this.state.itemPrices[ind].price}</span>
                            <span className="item-divider"></span>
                        </div>
                    )
                })}
            </div>
        )
    }

    render() {
        return (
            <div className="cart-container">
                <div id="order-summary-div">
                    <div className="order-summary">
                        Order Summary
                    </div>
                    <div>
                        <div className="fixed-scroll">
                            {/* loads and displays all items currently in the cart */}
                            {this.loadItems()}
                        </div>
                        <div className="order-totals">
                            <br />
                            Subtotal: ${this.state.subTotal}<br />
                            Tax: ${this.state.tax}
                        </div>
                    </div>
                    <div className="order-summary">
                        <span>Total Price</span><span className="add-price">${this.state.totalPrice}</span>
                    </div>
                    {/* button to open the cart summary */}
                    <Button style={{ backgroundColor: "#f9ce1d", borderColor: "#f9ce1d", color: "#000000" }} className="review-order-button" onClick={this.props.toggleCart}>Review Order</Button>
                </div>
            </div>
        )
    }

}

export default CartPreview;