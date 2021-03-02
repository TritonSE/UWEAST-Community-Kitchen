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
import "../css/Menu.css";

class Menu extends Component {

    //COokies object used to access and modify cookies
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor(props) {
        super(props);

        if(!localStorage.getItem("cartItems")) {
            localStorage.setItem("cartItems", JSON.stringify([]));
        }

        //creates cart cookie with default values if it doesn't exist
        if (!this.props.cookies.get("cart")) {
            let newCart = {
                prices: [],
                subtotal: "00.00",
                tax: "00.00",
                total: "00.00"
            }
            this.props.cookies.set("cart", newCart, { path: "/"});
        }

        //stores items currently in the cart using local storage
        this.state = {
            //stores items currently in the cart
            cartItems: JSON.parse(localStorage.getItem('cartItems')),

            //stores whether cart sumarry is currently visible or not
            cartPopupVisible: (this.props.location) ? this.props.location.cartVisible : false,

            itemPrices: this.props.cookies.get("cart").prices,

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

        const itemCost = item.price;

        delete item.price;

        //item.individual_tax = (parseFloat(item.price) * 0.0775).toFixed(2);

        this.setState({cartItems: [...this.state.cartItems, item]}, () => {
            localStorage.setItem('cartItems', JSON.stringify(this.state.cartItems))
        });

        const itemPrices = {
            price: itemCost,
            individual_tax: (parseFloat(itemCost) * 0.0775).toFixed(2)
        }

        //modifies cart object values to add new item
        cart.prices.push(itemPrices);
        cart.subtotal = (parseFloat(cart.subtotal) + parseFloat(itemCost)).toFixed(2);
        cart.tax = (parseFloat(cart.subtotal) * 0.0775).toFixed(2);
        cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.tax)).toFixed(2);

        //updates cart cookie and state values to rerender page
        cookies.set("cart", cart, { path: "/"});
        this.setState({ itemPrices: cart.prices, subTotal: cart.subtotal, tax: cart.tax, totalPrice: cart.total, cartKey: !this.state.cartKey, previewKey: !this.state.previewKey });
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

        let currItems = JSON.parse(localStorage.getItem('cartItems'));
        currItems.splice(ind, 1);
        localStorage.setItem('cartItems', JSON.stringify(currItems));

        //modifies cart object values to remove the item at index ind
        cart.subtotal = (parseFloat(cart.subtotal) - parseFloat(cart.prices[ind].price)).toFixed(2);
        cart.tax = (parseFloat(cart.subtotal) * 0.0775).toFixed(2);
        cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.tax)).toFixed(2);
        cart.prices.splice(ind, 1);

        //updates cart cookie and state values to rerender page
        cookies.set("cart", cart, { path: "/"});
        this.setState({ itemPrices: cart.prices, cartItems: currItems, subTotal: cart.subtotal, tax: cart.tax, totalPrice: cart.total, cartKey: !this.state.cartKey, previewKey: !this.state.previewKey });
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
        this.setState({cartItems: JSON.parse(localStorage.getItem('cartItems')), subTotal: this.props.cookies.get("cart").subtotal, tax: this.props.cookies.get("cart").tax, totalPrice: this.props.cookies.get("cart").total, previewKey: !this.state.previewKey});
    }

    render() {

        return (
            <div>
                <div className="navbar-wrapper">
                    <Navbar toggleCart={this.toggleCart} />
                </div>
                <Banner />
                {/* cart summary is conditionally rendered based on if it is currently open */}
                {this.state.cartPopupVisible ? <CartSummary key={this.state.cartKey} items={this.state.cartItems} itemPrices={this.state.itemPrices} total={this.state.totalPrice} tax={this.state.tax} subtotal={this.state.subTotal} toggleCart={this.toggleCart} removeItem={this.handleRemove} updateItems={this.updateItems}/> : null}
                <div className="cart-preview">
                {/* cart preview is floated on the bottom right of the screen */}
                <CartPreview key={this.state.previewKey} items={this.state.cartItems} itemPrices={this.state.itemPrices} total={this.state.totalPrice} tax={this.state.tax} subtotal={this.state.subTotal} toggleCart={this.toggleCart} />
                </div>
                {/** search section is the top, non-menu half of the page */}
                <SearchSection />
                <MenuSection onItemAdd={this.handleAdd}/>
            </div>

        )
    }
}

export default withRouter(withCookies(Menu));
