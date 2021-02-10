import React, { Component, useState} from 'react';
import Navbar from '../components/NavBar';
import CartPreview from '../components/CartPreview';
import CartSummary from '../components/CartSummary';
import SearchSection from '../components/SearchSection';
import MenuSection from '../components/MenuSection';
import Banner from '../components/Banner';
const config = require('../config');

const BACKEND_URL = config.backend.uri;

class Menu extends Component {
    constructor(props) {
        super(props);

        //stores items currently in the cart using local storage
        this.state = {
            items: JSON.parse(localStorage.getItem('cartItems')) || [],
            cartPopupVisible: false,
            subTotal: "00.00",
            tax: "00.00",
            totalPrice: "00.00"
        }

        this.toggleCart = this.toggleCart.bind(this);

    }

    //adds item from popup to the cart and updates local storage
    handleAdd = (item) => {
        this.setState({items: [...this.state.items, item]}, () => {
            localStorage.setItem('cartItems', JSON.stringify(this.state.items))
        });
        console.log(this.state.items);

        // this.state.subTotal = parseFloat(this.state.subTotal) + parseFloat(item.price);
        //             this.state.subTotal = parseFloat(this.state.subTotal).toFixed(2);
        //             this.state.totalPrice = parseFloat(this.state.subTotal) + parseFloat(this.state.tax);
        //             this.state.totalPrice = parseFloat(this.state.totalPrice).toFixed(2);
    }

    toggleCart() {
        this.setState({cartPopupVisible: !this.state.cartPopupVisible});
    }

    render (){

      return (
          <div>
              <div className="navbar-wrapper">
                <Navbar currentPage="menu"/>
              </div>
              <Banner/>
              {this.state.cartPopupVisible ? <CartSummary items={this.state.items} toggleCart={this.toggleCart}/> : null}
              {/* cart preview is floated on the bottom right of the screen */}
              <CartPreview key={this.state.items} items={this.state.items} total={this.state.totalPrice} tax={this.state.tax} subtotal={this.state.subTotal} toggleCart={this.toggleCart}/> 
              {/** search section is the top, non-menu half of the page */}
              <SearchSection/>
              <MenuSection onItemAdd={this.handleAdd}/> 
          </div>

      )
    }
  }
  
  export default Menu;