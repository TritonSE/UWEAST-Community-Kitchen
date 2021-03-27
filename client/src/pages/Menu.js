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
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import {Link} from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import "../css/Menu.css";
import { Button } from 'react-bootstrap';
import {ORDER_SERVICE_TAX_RATE} from '../util/constants.js';

import CookiesBanner from "../components/CookiesBanner";

const config = require('../config');

class Menu extends Component {

    //Cookies object used to access and modify cookies
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor(props) {
        super(props);

        // const { urlData } = this.props.location;

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
            cartItems: this.props.cookies.get("cart") ? this.props.cookies.get("cart").items : [],

            //stores whether cart sumarry is currently visible or not
            cartPopupVisible: (this.props.location && this.props.location.cartVisible) ? this.props.location.cartVisible : false,

            //stores subtotal of items in the cart
            subTotal: this.props.cookies.get("cart") ? this.props.cookies.get("cart").subtotal : "00.00",

            //stores total tax of items in the cart
            tax: this.props.cookies.get("cart") ? this.props.cookies.get("cart").tax : "00.00",

            //stores total price of items in cart
            totalPrice: this.props.cookies.get("cart") ? this.props.cookies.get("cart").total : "00.00",

            //key values to update child components when a state changes
            cartKey: false,
            previewKey: true,

            //stores whether cart limit popup is visible
            limitPopupVisible: false
        }

        this.toggleCart = this.toggleCart.bind(this);
        this.updateItems = this.updateItems.bind(this);
    }

    /**
     * Returns the size of the input string in bytes
     * 
     * @param {String} string - the string to get byte size of
     * @returns 
     */
    byteSize = (string) => {
        return new Blob([string]).size;
    }
    
    /**
     * adds selected item to the cart and updates totals and cookies
     * 
     * @param {*} item - item object to add to the cart
     */
    handleAdd = (item) => {

        //check if cookies are disabled
        if(!navigator.cookieEnabled) {
            alert("Please enable your cookies and reload the page to use this website.");
            return;
        }

        //gets current cart object from cookies
        const { cookies } = this.props;
        let cart = cookies.get("cart");

        const popupValues = JSON.parse(item.popupValues);

        //gets the cart cookie and its value
        let cartIndex = 0;
        const oldCookies = document.cookie;
        const oldCookieFields = oldCookies.split(";");
        oldCookieFields.forEach(function (value, index) {
            const cookieNameValue = value.split("=");
            if(cookieNameValue[0] === " cart") {
                cartIndex = index;
            }
        });

        //finds size of initial cart cookie
        const oldSize = this.byteSize(oldCookieFields[cartIndex]);

        //creates array representation of item object
        let newItem = [];
        newItem.push(popupValues.id, popupValues.title, item.price, item.quantity, item.size, item.instructions);
        if (item.accommodations) {
            newItem.push(item.accommodations);
        }

        //modifies cart price values and adds new item
        cart.items.push(newItem);
        cart.subtotal = (parseFloat(cart.subtotal) + parseFloat(item.price)).toFixed(2);
        cart.tax = (parseFloat(cart.subtotal) * ORDER_SERVICE_TAX_RATE).toFixed(2);
        cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.tax)).toFixed(2);

        //updates cart cookie and state values to rerender page
        cookies.set("cart", cart, { path: "/" });

        //finds size of cart cookie after adding item
        const newCookies = document.cookie;
        const newCookieFields = newCookies.split(";");
        const newSize = this.byteSize(newCookieFields[cartIndex]);

        //displays error popup if cookie limit is reached
        if(oldSize === newSize) {
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

        //check if cookies are disabled
        if(!navigator.cookieEnabled) {
            alert("Please enable your cookies and reload the page to use this website.");
            return;
        }

        //gets current cart object from cookies
        const { cookies } = this.props;
        let cart = cookies.get("cart");

        //modifies cart price values and removes item at index
        cart.subtotal = (parseFloat(cart.subtotal) - parseFloat(cart.items[ind][2])).toFixed(2);
        cart.tax = (parseFloat(cart.subtotal) * ORDER_SERVICE_TAX_RATE).toFixed(2);
        cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.tax)).toFixed(2);
        cart.items.splice(ind, 1);

        //updates cart cookie and state values to rerender page
        cookies.set("cart", cart, { path: "/" });
        this.setState({ cartItems: cart.items, subTotal: cart.subtotal, tax: cart.tax, totalPrice: cart.total, cartKey: !this.state.cartKey, previewKey: !this.state.previewKey });
    }

    /**
     * Chages state to open or close add item error popup
     */
    handleCloseModal = () => {
        this.setState({limitPopupVisible: !this.state.limitPopupVisible});
    }

    /**
     * Changes cartPopupVisible state to open or close the cart popup
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

    /**
     * Parses state information to determine whether to display its cart summary to the user. Utilizes information
     * passed by NavBar upon cart icon click. If not called by NavBar, will just do normal render of entire page. 
     */
    componentDidMount() {
        let showCart = false;

        // parse location object to see if cart must be toggled upon render
        try{
            showCart = this.props.location.state.toggleCart; 
        } catch(err){
            showCart = false;
        }

        // toggle cart if required
        if(showCart){
            this.toggleCart();
        }

        // clear loaded values so refreshes/redirects start anew
        this.props.history.replace('/', null);
        console.log("Config: \n");
        console.log("Maps API: " + config.google.MAPS_API_CODE);
        console.log("Backend: " + config.backend.uri);
        console.log("ENV: \n");
        console.log("Maps API: " + process.env.REACT_APP_MAPS_API_CODE);
        console.log("Backend: " + process.env.REACT_APP_BACKEND_URI);
     }

    render() {

        return (
            <div>
                <div className="navbar-wrapper">
                    <Navbar page="home" toggleCart={this.toggleCart} itemCount={this.state.cartItems.length} />
                </div>
                {/* Dialog is displayed if cart item limit is reached */}
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
                <CookiesBanner/>
            </div>

        )
    }
}

export default withRouter(withCookies(Menu));
