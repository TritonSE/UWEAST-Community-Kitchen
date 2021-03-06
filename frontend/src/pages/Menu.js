/**
 * Entry point of the Menu page on the website. It renders all components that are part of the menu page,
 * including the cart preview, cart summary, menu section, and search section. The search section stores 
 * the header image and the menu section stores the menu items and item cart. It also contains the
 * cart, which is tracked by states, and handles adding and removing items from the cart. This file 
 * depends on the CartPreview, CartSummary, SearchSection, MenuSection, Navbar, and Banner components.
 * 
 * @summary Renders the menu page and all components that are on this page.
 * @author Dhanush Nanjunda Reddy
 * @author Navid Boloorian
 */
import React, { Component } from 'react';
import Navbar from '../components/NavBar';
import CartPreview from '../components/CartPreview';
import CartSummary from '../components/CartSummary';
import SearchSection from '../components/SearchSection';
import MenuSection from '../components/MenuSection';
import Banner from '../components/Banner';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import {Link} from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import sizeof from 'object-sizeof';
import "../css/Menu.css";
import { Button } from 'react-bootstrap';

class Menu extends Component {

    //Cookies object used to access and modify cookies
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor(props) {
        super(props);

        //creates cart in local storage if it doesn't exist
        // if(!localStorage.getItem("cartItems")) {
        //     localStorage.setItem("cartItems", JSON.stringify([]));
        // }

        //creates cart cookie with default values if it doesn't exist
        if (!this.props.cookies.get("cart")) {
            let newCart = {
                items: [],
                subtotal: "00.00",
                tax: "00.00",
                total: "00.00"
            }
            this.props.cookies.set("cart", newCart, { path: "/" });
        }

        //stores items currently in the cart using local storage
        this.state = {
            //stores items currently in the cart
            cartItems: this.props.cookies.get("cart").items,

            //stores whether cart sumarry is currently visible or not
            cartPopupVisible: (this.props.location) ? this.props.location.cartVisible : false,

            //stores price of each item
            // itemPrices: this.props.cookies.get("cart").prices,

            //stores subtotal of items in the cart
            subTotal: this.props.cookies.get("cart").subtotal,

            //stores total tax of items in the cart
            tax: this.props.cookies.get("cart").tax,

            //stores total price of items in cart
            totalPrice: this.props.cookies.get("cart").total,

            //key values to update child components when a state changes
            cartKey: false,
            previewKey: true,
            limitPopupVisible: false
        }

        this.toggleCart = this.toggleCart.bind(this);
        this.updateItems = this.updateItems.bind(this);
    }

    getByteSize = (cookie) => {
        return encodeURIComponent('<q></q>' + cookie).length;
    }

    byteSize = (string) => {
        return new Blob([string]).size;
    }
    /**
     * adds selected item to the cart and updates totals and cookies
     * 
     * @param {*} item - item object to add to the cart
     */
    handleAdd = (item) => {
        //gets current cart object from cookies
        const { cookies } = this.props;
        let cart = cookies.get("cart");

        const popupValues = JSON.parse(item.popupValues);


        const oldCookies = document.cookie;
        const oldCookieFields = oldCookies.split(";");
        const oldSize = this.byteSize(oldCookieFields[1]);
        console.log(oldSize); 

        const itemId = popupValues.id;
        const itemName = popupValues.title;
        delete item.popupValues;
        item.id = itemId;
        item.name = itemName;
        console.log(item);
        let newItem = [];
        newItem.push(item.id, item.name, item.price, item.quantity, item.size, item.instructions);
        if (item.accommodations) {
            newItem.push(item.accommodations);
        }
        // console.log(Buffer.from(JSON.stringify(item)).length);
        // console.log(this.byteSize(item));
        //modifies cart price values to add new item
        cart.items.push(newItem);
        cart.subtotal = (parseFloat(cart.subtotal) + parseFloat(item.price)).toFixed(2);
        cart.tax = (parseFloat(cart.subtotal) * 0.0775).toFixed(2);
        cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.tax)).toFixed(2);

        //updates cart cookie and state values to rerender page
        cookies.set("cart", cart, { path: "/" });
        const newCookies = document.cookie;
        const newCookieFields = newCookies.split(";");
        const newSize = this.byteSize(newCookieFields[1]);
        console.log(newSize);
        if(oldSize === newSize) {
            const str = "contact us";
            const linkStr = str.link(window.location.href + "contact");
            // alert("Item cannot be added. Cart is already full. If you'd like to make a larger order, we suggest that you" + linkStr + "directly so we can better accommodate your needs.");
            this.setState({limitPopupVisible: true});
        } else {
            this.setState({ cartItems: cart.items, subTotal: cart.subtotal, tax: cart.tax, totalPrice: cart.total, cartKey: !this.state.cartKey, previewKey: !this.state.previewKey });
        }
    }

    /**
     * Removes the item at index ind from the cart
     * 
     * @param {number} ind - index of the item to be removed 
     */
    handleRemove = (ind) => {
        //gets current cart object from cookies
        const { cookies } = this.props;
        let cart = cookies.get("cart");

        //removes item at index from cart
        // let currItems = JSON.parse(localStorage.getItem('cartItems'));
        // currItems.splice(ind, 1);
        // localStorage.setItem('cartItems', JSON.stringify(currItems));

        //modifies cart price values to remove item at index
        cart.subtotal = (parseFloat(cart.subtotal) - parseFloat(cart.items[ind][2])).toFixed(2);
        cart.tax = (parseFloat(cart.subtotal) * 0.0775).toFixed(2);
        cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.tax)).toFixed(2);
        //cart.prices.splice(ind, 1);
        cart.items.splice(ind, 1);

        //updates cart cookie and state values to rerender page
        cookies.set("cart", cart, { path: "/" });
        this.setState({ cartItems: cart.items, subTotal: cart.subtotal, tax: cart.tax, totalPrice: cart.total, cartKey: !this.state.cartKey, previewKey: !this.state.previewKey });
    }

    handleCloseModal = () => {
        this.setState({limitPopupVisible: !this.state.limitPopupVisible});
    }

    /**
     * Changes cartPopupVisible state to open or close the popup
     */
    toggleCart() {
        this.setState({ cartPopupVisible: !this.state.cartPopupVisible });
    }

    /**
     * Updates cart states when an item is edited in the cart
     */
    updateItems() {
        this.setState({ cartItems: this.props.cookies.get("cart").items, subTotal: this.props.cookies.get("cart").subtotal, tax: this.props.cookies.get("cart").tax, totalPrice: this.props.cookies.get("cart").total, previewKey: !this.state.previewKey });
    }

    render() {

        return (
            <div>
                <div className="navbar-wrapper">
                    <Navbar toggleCart={this.toggleCart} />
                </div>
                <Banner />
                <div>
                <Dialog
                    open={this.state.limitPopupVisible}
                    onClose={this.handleCloseModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Cart Item Limit Reached"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        Item cannot be added. Cart is already full. If you'd like to make a larger order, we suggest that you <Link to="/contact">contact us</Link> directly so we can better accommodate your needs.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseModal} color="primary" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
                </div>
                {/* cart summary is conditionally rendered based on if it is currently open */}
                {this.state.cartPopupVisible ? <CartSummary key={this.state.cartKey} items={this.state.cartItems} total={this.state.totalPrice} tax={this.state.tax} subtotal={this.state.subTotal} toggleCart={this.toggleCart} removeItem={this.handleRemove} updateItems={this.updateItems} /> : null}
                <div className="cart-preview">
                    {/* cart preview is floated on the bottom right of the screen */}
                    <CartPreview key={this.state.previewKey} items={this.state.cartItems} total={this.state.totalPrice} tax={this.state.tax} subtotal={this.state.subTotal} toggleCart={this.toggleCart} />
                </div>
                {/** search section is the top, non-menu half of the page */}
                <SearchSection />
                <MenuSection onItemAdd={this.handleAdd} />
            </div>

        )
    }
}

export default withRouter(withCookies(Menu));
