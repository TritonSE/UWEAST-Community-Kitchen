import React, { Component, useEffect } from 'react';
import {Button} from 'react-bootstrap';
import '../css/CartPreview.css';

class CartPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            subTotal: "00.00",
            tax: "00.00",
            totalPrice: "00.00"
        }

        this.loadItems = this.loadItems.bind(this);
    }
    
    //displays items currently in the cart and updates subtotal and total
    loadItems() {
        return(
            <div>
                {this.state.items.map((item, ind) => {

                    this.state.subTotal = parseFloat(this.state.subTotal) + parseFloat(item.price);
                    this.state.subTotal = parseFloat(this.state.subTotal).toFixed(2);
                    this.state.tax = (parseFloat(this.state.subTotal)*0.0775).toFixed(2);
                    this.state.totalPrice = parseFloat(this.state.subTotal) + parseFloat(this.state.tax);
                    this.state.totalPrice = parseFloat(this.state.totalPrice).toFixed(2);

                    let specialInstructions = (item.instructions === "") ? "" : ", " + item.instructions;
                    let accommodation = (item.accommodations) ? ", " + item.accommodations : "";

                    let extraInfo = item.size + specialInstructions  + accommodation;

                        return (
                            <div key={ind} className="summary-item row">
                                <span className="thumbnail thumb-img">{ind+1}</span>
                                <span className="item-info">{item.quantity} X {item.name}<br/>
                                <span className="item-description">{extraInfo}</span></span>
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
                            <br/>
                            Subtotal: ${this.state.subTotal}<br/>
                            Tax: ${this.state.tax}
                        </div>
                        <Button>Review Order</Button>
                    </div>
                    <div className="order-summary">
                        <span>Total Price</span><span className="add-price">${this.state.totalPrice}</span>
                    </div>
                </div>
            </div>
        )
    }

}

export default CartPreview;