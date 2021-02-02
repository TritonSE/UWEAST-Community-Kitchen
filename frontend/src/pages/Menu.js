import React, { Component} from 'react';
import Navbar from '../components/NavBar';
import CartPreview from '../components/CartPreview';
import SearchSection from '../components/SearchSection';
import MenuSection from '../components/MenuSection';
import MenuItemPopup from '../components/MenuItemPopup'
const config = require('../config');

const BACKEND_URL = config.backend.uri;

class Menu extends Component {
    constructor(props) {
        super(props);

        //stores items currently in the cart
        this.state = {
            items: []
        }
    }

    //adds item from popup to the cart
    handleAdd = (item) => {
        this.setState({items: [...this.state.items, item]});
        console.log(this.state.items);
    }

    render (){

      return (
          <div>
              <Navbar currentPage="menu"/>
              {/* cart preview is floated on the bottom right of the screen */}
              <CartPreview key={this.state.items} items={this.state.items}/> 
              {/** search section is the top, non-menu half of the page */}
              <SearchSection/>
              <MenuSection onItemAdd={this.handleAdd}/> 
          </div>

      )
    }
  }
  
  export default Menu;