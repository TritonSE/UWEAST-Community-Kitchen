import React, { Component, useEffect } from 'react';
import {Button} from 'react-bootstrap';
import '../css/CartPreview.css';

class CartPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // items: [{name: "Salad", quantity: 2, price: 10, description: "vegan"}, 
            // {name: "Bread", quantity: 3, price: 5, description: ""}, 
            // {name: "Sandwich", quantity: 1, price: 8, description: "Extra sauce"},
            // {name: "Burger", quantity: 2, price: 15, description: "gluten free"}]
            items: this.props.items,
            subTotal: "00.00",
            tax: "00.00",
            totalPrice: "00.00"
        }

        this.loadItems = this.loadItems.bind(this);
    }

    loadItems() {
        return(
            <div>
                {this.state.items.map((item, ind) => {
                    this.state.subTotal = parseFloat(this.state.subTotal) + parseFloat(item.price);
                    this.state.subTotal = parseFloat(this.state.subTotal).toFixed(2);
                    this.state.totalPrice = this.state.subTotal + this.state.tax;
                    this.state.totalPrice = parseFloat(this.state.totalPrice).toFixed(2);
                        return (
                            <div class="summary-item row">
                                <span class="thumbnail thumb-img">{ind+1}</span>
                                <span class="item-info">{item.quantity} X {item.name}<br/>
                                <span class="item-description">{item.description}</span></span>
                                <span class="thumbnail summary-price">${item.price}</span>
                                <span class="item-divider"></span>
                            </div>
                        )
                })}
            </div>
        )
    }

    render() {
        return (
            <div class="cart-container">
                <div id="order-summary-div">
                    <div class="order-summary">
                        Order Summary
                    </div>
                    <div>
                        <div class="fixed-scroll">
                            {this.loadItems()}
                        </div>
                        <div class="order-totals">
                            <br/>
                            Subtotal: ${this.state.subTotal}<br/>
                            Tax: ${this.state.tax}
                        </div>
                        {/* <button id="cart-modal" type="button">
                            Review Order
                        </button> */}
                        <Button>Review Order</Button>
                    </div>
                    <div class="order-summary">
                        <span>Total Price</span><span class="add-price">${this.state.totalPrice}</span>
                    </div>
                </div>
            </div>
        )
    }

}

export default CartPreview;