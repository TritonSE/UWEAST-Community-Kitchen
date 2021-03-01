/**
 * Entry point of the Menu page on the website. It renders all components that are part of the menu page,
 * including the cart preview, cart summary, menu section, and search section. It also contains the
 * cart, which is tracked by states, and handles adding and removing items from the cart. This file 
 * depends on the CartPreview, CartSummary, SearchSection, MenuSection, Navbar, and Banner components.
 * 
 * @summary Displays the menu page and all components that are on this page.
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
import "../css/Menu.css";

class Menu extends Component {

    //COokies object used to access and modify cookies
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor(props) {
        super(props);

        //creates cart cookie with default values if it doesn't exist
        if (!this.props.cookies.get("cart")) {
            let newCart = {
                items: [],
                subtotal: "00.00",
                tax: "00.00",
                total: "00.00"
            }
            this.props.cookies.set("cart", newCart, { path: "/"});
        }

        //stores items currently in the cart using local storage
        this.state = {
            //stores items currently in the cart
            cartItems: this.props.cookies.get("cart").items,

            //stores whether cart sumarry is currently visible or not
            cartPopupVisible: (this.props.location) ? this.props.location.cartVisible : false,

            //stores subtotal of items in the cart
            subTotal: this.props.cookies.get("cart").subtotal,

            //stores total tax of items in the cart
            tax: this.props.cookies.get("cart").tax,

            //stores total price of items in cart
            totalPrice: this.props.cookies.get("cart").total,

            //key values to update child components when a state changes
            cartKey: false,
            previewKey: true
        }

        this.toggleCart = this.toggleCart.bind(this);
        this.updateItems = this.updateItems.bind(this);
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

        item.individual_tax = (parseFloat(item.price) * 0.0775).toFixed(2);

        //modifies cart object values to add new item
        cart.items.push(item);
        cart.subtotal = (parseFloat(cart.subtotal) + parseFloat(item.price)).toFixed(2);
        cart.tax = (parseFloat(cart.subtotal) * 0.0775).toFixed(2);
        cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.tax)).toFixed(2);

        //updates cart cookie and state values to rerender page
        cookies.set("cart", cart, { path: "/"});
        this.setState({ cartItems: cart.items, subTotal: cart.subtotal, tax: cart.tax, totalPrice: cart.total, cartKey: !this.state.cartKey, previewKey: !this.state.previewKey });
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

        //modifies cart object values to remove the item at index ind
        cart.subtotal = (parseFloat(cart.subtotal) - parseFloat(cart.items[ind].price)).toFixed(2);
        cart.tax = (parseFloat(cart.subtotal) * 0.0775).toFixed(2);
        cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.tax)).toFixed(2);
        cart.items.splice(ind, 1);

        //updates cart cookie and state values to rerender page
        cookies.set("cart", cart, { path: "/"});
        this.setState({ cartItems: cart.items, subTotal: cart.subtotal, tax: cart.tax, totalPrice: cart.total, cartKey: !this.state.cartKey, previewKey: !this.state.previewKey });
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
        this.setState({cartItems: this.props.cookies.get("cart").items, subTotal: this.props.cookies.get("cart").subtotal, tax: this.props.cookies.get("cart").tax, totalPrice: this.props.cookies.get("cart").total, previewKey: !this.state.previewKey});
    }

    render() {

        return (
            <div>
                <div className="navbar-wrapper">
                    <Navbar toggleCart={this.toggleCart} />
                </div>
                <Banner />
                {/* cart summary is conditionally rendered based on if it is currently open */}
                {this.state.cartPopupVisible ? <CartSummary key={this.state.cartKey} items={this.state.cartItems} total={this.state.totalPrice} tax={this.state.tax} subtotal={this.state.subTotal} toggleCart={this.toggleCart} removeItem={this.handleRemove} updateItems={this.updateItems}/> : null}
                <div className="cart-preview">
                {/* cart preview is floated on the bottom right of the screen */}
                <CartPreview key={this.state.previewKey} items={this.state.cartItems} total={this.state.totalPrice} tax={this.state.tax} subtotal={this.state.subTotal} toggleCart={this.toggleCart} />
                </div>
                {/** search section is the top, non-menu half of the page */}
                <SearchSection />
                <MenuSection onItemAdd={this.handleAdd}/>
            </div>

        )
    }
}

export default withRouter(withCookies(Menu));