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

        this.state = {
            items: [{name: "Salad", quantity: 2, price: "00.00", description: "vegan and some more ingredients on top to help show some support"}]
        }
    }

    handleAdd = (item) => {
        this.setState({items: [...this.state.items, item]});
        console.log(this.state.items);
    }

    render (){

      return (
          <div>
              <Navbar currentPage="menu"/>
              {/* <div style={{marginTop: "30px"}}>
                  This is the Menu Page.
              </div>            */}
              <CartPreview key={this.state.items} items={this.state.items}/> 
              {/** search section is the top, non-menu half of the page */}
              <SearchSection/>
              <MenuSection onItemAdd={this.handleAdd}/> 
          </div>

      )
    }
  }
  
  export default Menu;