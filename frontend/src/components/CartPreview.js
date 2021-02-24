import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import '../css/CartPreview.css';

class CartPreview extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            subTotal: this.props.subtotal,
            tax: this.props.tax,
            totalPrice: this.props.total
        }

        this.loadItems = this.loadItems.bind(this);
    }

    //displays items currently in the cart and updates subtotal and total
    loadItems() {
        return (
            <div>
                {this.state.items.map((item, ind) => {

                    const popupValues = JSON.parse(item.popupValues);

                    let accom = "";
                    if (item.accommodations && Array.isArray(item.accommodations)) {
                        item.accommodations.forEach((accommodation) => {
                            accom = accom + ", " + accommodation;
                        })
                    } else if (item.accommodations) {
                        accom = ", " + item.accommodations;
                    }
                    let size = item.size;
                    let extraInfo = size + accom;

                    return (
                        <div key={ind} className="summary-item row">
                            <span className="thumbnail thumb-img">{ind + 1}</span>
                            <span className="item-info">{item.quantity} X {popupValues.title}<br />
                                <span className="item-description">{extraInfo}<br />
                                    {(item.instructions !== "") ? <span>Special Instr.: {item.instructions}</span> : null}
                                </span></span>
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
                            <br />
                            Subtotal: ${this.state.subTotal}<br />
                            Tax: ${this.state.tax}
                        </div>
                        <div className="order-summary">
                            <span>Total Price</span><span className="add-price">${this.state.totalPrice}</span>
                        </div>
                    </div>
                    <Button className="review-order-button" onClick={this.props.toggleCart}>Review Order</Button>
                </div>
            </div>
        )
    }

}

export default withCookies(CartPreview);