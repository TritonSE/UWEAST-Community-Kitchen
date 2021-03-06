/**
 * Cart preview component that displays the items currently in the cart. It renders the items in the
 * cart, with each item's name, quantity, size, accommodations (if any), special instructions (if any),
 * and price. It also renders a button that opens the cart summary. This file has no dependencies on
 * other files or components.
 *
 * @summary Displays the cart preview on desktop in the bottom-right corner of the screen.
 * @author Dhanush Nanjunda Reddy
 */
import React, { Component } from "react";
import { Button } from "react-bootstrap";
import "../css/CartPreview.css";

class CartPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // stores items in the cart
      items: this.props.items,

      // stores subtotal of items in the cart
      subTotal: this.props.subtotal,

      // stores total tax for items in the cart
      tax: this.props.tax,

      // stores total price of items in the cart
      totalPrice: this.props.total,
    };

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
            <div key={ind} className="summary-item row">
              <span className="thumbnail thumb-img">{ind + 1}</span>
              <span className="item-info">
                {item[3]} X {item[1]}
                <br />
                <span className="item-description">
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
              <span className="thumbnail summary-price">${item[2]}</span>
              <span className="item-divider" />
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <div className="cart-container">
        <div id="order-summary-div">
          <div className="order-summary">Order Summary</div>
          <div>
            <div className="fixed-scroll">
              {/* loads and displays all items currently in the cart */}
              {this.loadItems()}
            </div>
            <div className="order-totals">
              <br />
              Subtotal: ${this.state.subTotal}
              <br />
              Tax: ${this.state.tax}
            </div>
          </div>
          <div className="order-summary">
            <span>Total Price</span>
            <span className="add-price">${this.state.totalPrice}</span>
          </div>
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
          {/* button to open the cart summary */}
          <Button variant="gold" onClick={this.props.toggleCart} block>
            Review Order
          </Button>
        </div>
      </div>
    );
  }
}

export default CartPreview;
