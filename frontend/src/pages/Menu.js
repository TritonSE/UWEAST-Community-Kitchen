import React, { Component } from 'react';
import Navbar from '../components/NavBar';
import CartPreview from '../components/CartPreview';
import CartSummary from '../components/CartSummary';
import SearchSection from '../components/SearchSection';
import MenuSection from '../components/MenuSection';
import Banner from '../components/Banner';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
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
            cartKey: false,
            previewKey: true,
            popupFunc: null
        }

        this.toggleCart = this.toggleCart.bind(this);
    }

    componentDidMount() {
        // console.log(this.props.location.state);
        if (!this.props.cookies.get("cart")) {
            let newCart = {
                items: [],
                subtotal: "00.00",
                tax: "00.00",
                total: "00.00"
            }

            this.props.cookies.set("cart", newCart, { path: "/"});
        }

        this.setState({ cartKey: !this.state.cartKey, previewKey: !this.state.previewKey });
    }

    //adds item from popup to the cart and updates local storage
    handleAdd = (item) => {
        const { cookies } = this.props;
        let cart = cookies.get("cart");
        console.log(item);

        const popupValues = JSON.parse(item.popupValues);
        if (popupValues.fillIns) {
            let oldItem = cart.items[popupValues.fillIns.index];
            cart.items.splice(popupValues.fillIns.index, 1);
            console.log(oldItem);
            cart.items.splice(popupValues.fillIns.index, 0, item);
            cart.subtotal = (parseFloat(cart.subtotal) - parseFloat(oldItem.price) + parseFloat(item.price)).toFixed(2);
        } else {
            cart.items.push(item);
            cart.subtotal = (parseFloat(cart.subtotal) + parseFloat(item.price)).toFixed(2);
        }
        cart.tax = (parseFloat(cart.subtotal) * 0.0775).toFixed(2);
        cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.tax)).toFixed(2);
        cookies.set("cart", cart, { path: "/"});
        this.setState({ cartItems: cart.items, subTotal: cart.subtotal, tax: cart.tax, totalPrice: cart.total, cartKey: !this.state.cartKey, previewKey: !this.state.previewKey });
    }

    handleRemove = (ind) => {
        const { cookies } = this.props;
        let cart = cookies.get("cart");
        cart.subtotal = (parseFloat(cart.subtotal) - parseFloat(cart.items[ind].price)).toFixed(2);
        cart.tax = (parseFloat(cart.subtotal) * 0.0775).toFixed(2);
        cart.total = (parseFloat(cart.subtotal) + parseFloat(cart.tax)).toFixed(2);
        cart.items.splice(ind, 1);
        cookies.set("cart", cart, { path: "/"});
        this.setState({ cartItems: cart.items, subTotal: cart.subtotal, tax: cart.tax, totalPrice: cart.total, cartKey: !this.state.cartKey, previewKey: !this.state.previewKey });
    }

    toggleCart() {
        this.setState({ cartPopupVisible: !this.state.cartPopupVisible });
    }

    setPopupFunc = (togglePopup) => {
        this.state.popupFunc = togglePopup;
    }

    render() {

        return (
            <div>
                <div className="navbar-wrapper">
                    <Navbar toggleCart={this.toggleCart} />
                </div>
                <Banner />
                {this.state.cartPopupVisible ? <CartSummary key={this.state.cartKey} items={this.state.cartItems} total={this.state.totalPrice} tax={this.state.tax} subtotal={this.state.subTotal} toggleCart={this.toggleCart} removeItem={this.handleRemove} popupFunc={this.state.popupFunc} /> : null}
                <div className="cart-preview">
                {/* cart preview is floated on the bottom right of the screen */}
                <CartPreview key={this.state.previewKey} items={this.state.cartItems} total={this.state.totalPrice} tax={this.state.tax} subtotal={this.state.subTotal} toggleCart={this.toggleCart} />
                </div>
                {/** search section is the top, non-menu half of the page */}
                <SearchSection />
                <MenuSection onItemAdd={this.handleAdd} popupFunc={this.setPopupFunc} />
            </div>

        )
    }
}

export default withCookies(Menu);