import React, { Component, useState} from 'react';
import Navbar from '../components/NavBar';
import CartPreview from '../components/CartPreview';
import CartSummary from '../components/CartSummary';
import SearchSection from '../components/SearchSection';
import MenuSection from '../components/MenuSection';
import Banner from '../components/Banner';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
const config = require('../config');

const BACKEND_URL = config.backend.uri;
import "../css/Menu.css";

class Menu extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor(props) {
        super(props);

        //stores items currently in the cart using local storage
        this.state = {
            cartItems: (this.props.cookies.get("cart")) ? this.props.cookies.get("cart").items : [],
            cartPopupVisible: false,
            subTotal: (this.props.cookies.get("cart")) ? this.props.cookies.get("cart").subtotal : "00.00",
            tax: (this.props.cookies.get("cart")) ? this.props.cookies.get("cart").tax : "00.00",
            totalPrice: (this.props.cookies.get("cart")) ? this.props.cookies.get("cart").total : "00.00",
            cartKey: 0
        }

        this.toggleCart = this.toggleCart.bind(this);
    }

    componentDidMount() {
        if(!this.props.cookies.get("cart")) {
            let newCart = {
                items: [],
                subtotal: "00.00",
                tax: "00.00",
                total: "00.00"
            }

            this.props.cookies.set("cart", newCart);
        }

        this.setState({cartKey: this.state.cartItems.length});
    }

    //adds item from popup to the cart and updates local storage
    handleAdd = (item) => {
        const { cookies } = this.props;
        let cart = cookies.get("cart");
        cart.items.push(item);
        cart.subtotal = (parseFloat(cart.subtotal) + parseFloat(item.price)).toFixed(2);
        cart.tax = (parseFloat(cart.subtotal)*0.0775).toFixed(2);
        cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.tax)).toFixed(2);
        cookies.set("cart", cart);
        this.setState({cartItems: cart.items, subTotal: cart.subtotal, tax: cart.tax, totalPrice: cart.total, cartKey: this.state.cartItems.length});
    }

    handleRemove = (ind) => {
        const { cookies } = this.props;
        let cart = cookies.get("cart");
        cart.subtotal = (parseFloat(cart.subtotal) - parseFloat(cart.items[ind].price)).toFixed(2);
        cart.tax = (parseFloat(cart.subtotal)*0.0775).toFixed(2);
        cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.tax)).toFixed(2);
        cart.items.splice(ind, 1);
        cookies.set("cart", cart);
        this.setState({cartItems: cart.items, subTotal: cart.subtotal, tax: cart.tax, totalPrice: cart.total, cartKey: this.state.cartItems.length});
    }

    toggleCart() {
        this.setState({cartPopupVisible: !this.state.cartPopupVisible});
    }

    render (){

      return (
          <div>
              <div className="navbar-wrapper">
                <Navbar/>
              </div>
              <Banner/>
              {this.state.cartPopupVisible ? <CartSummary key={this.state.cartKey} items={this.state.cartItems} total={this.state.totalPrice} tax={this.state.tax} subtotal={this.state.subTotal} toggleCart={this.toggleCart} removeItem={this.handleRemove}/> : null}
              {/* cart preview is floated on the bottom right of the screen */}
              <CartPreview key={this.state.cartItems} items={this.state.cartItems} total={this.state.totalPrice} tax={this.state.tax} subtotal={this.state.subTotal} toggleCart={this.toggleCart}/> 
              {/** search section is the top, non-menu half of the page */}
              <SearchSection/>
              <MenuSection onItemAdd={this.handleAdd}/> 
          </div>

      )
    }
  }
  
  export default withCookies(Menu);