/**
 * This page renders the menu page with two sections: the search section and 
 * the menu section. The search section stores the header image and the menu 
 * section stores the menu items and item cart.
 * 
 * @summary   Renders the menu page.
 */

import React, { Component} from 'react';
import Navbar from '../components/NavBar';
import CartPreview from '../components/CartPreview';
import SearchSection from '../components/SearchSection';
import MenuSection from '../components/MenuSection';
import Banner from '../components/Banner';
import "../css/Menu.css";

class Menu extends Component {
    constructor(props) {
        super(props);

        //stores items currently in the cart using local storage
        this.state = {
            items: JSON.parse(localStorage.getItem('cartItems')) || []
        }
    }

    //adds item from popup to the cart and updates local storage
    handleAdd = (item) => {
        this.setState({items: [...this.state.items, item]}, () => {
            localStorage.setItem('cartItems', JSON.stringify(this.state.items))
        });
        console.log(this.state.items);
    }

    render (){

      return (
          <div>
              <div className="navbar-wrapper">
                <Navbar/>
              </div>
              <Banner/>
              <div className="cart-preview">
              {/* cart preview is floated on the bottom right of the screen */}
              <CartPreview key={this.state.items} items={this.state.items}/> 
              </div>
              {/** search section is the top, non-menu half of the page */}
              <SearchSection/>
              <MenuSection onItemAdd={this.handleAdd}/> 
          </div>

      )
    }
  }
  
  export default Menu;