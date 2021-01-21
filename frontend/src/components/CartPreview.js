import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import '../css/CartPreview.css';

class CartPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [{name: "Salad", quantity: 2, price: 10, description: "vegan"}, 
            {name: "Bread", quantity: 3, price: 5, description: ""}, 
            {name: "Sandwich", quantity: 1, price: 8, description: "Extra sauce"},
            {name: "Burger", quantity: 2, price: 15, description: "gluten free"}]
        }

        this.loadItems = this.loadItems.bind(this);
    }

    loadItems() {
        return(
            <div>
                {this.state.items.map((item, ind) => {
                        return (
                            <div class="summart-item row">
                                <span class="thumbnail thumb-img">{ind+1}</span>
                                <span class="item-info">{item.quantity} X {item.name}<br/>
                                <span class="item-description">{item.description}</span></span>
                                <span class="thumbnail summary-price">${item.price}</span>
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
                            Subtotal: $00.00<br/>
                            Tax: $00.00
                        </div>
                        {/* <button id="cart-modal" type="button">
                            Review Order
                        </button> */}
                        <Button>Review Order</Button>
                    </div>
                    <div class="order-summary">
                        <span>Total price</span><span class="add-price">$00.00</span>
                    </div>
                </div>
            </div>
        )
    }

}

export default CartPreview;