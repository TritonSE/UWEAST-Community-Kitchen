 /**
  * The NavBar component. Renders at the top of the website and is fixed to the top.
  * Cart Icon is used for the mobile/tablet rendering of the webpage. 
  * 
  * @summary NavBar at the top of each page, used to navigate the website.
  */

import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import Logo from "../media/UWEAST_Logo_Detail_Transparent.png";
import '../css/NavBar.css';
import { isAuthenticated, logout } from '../util/Auth';
import { useCookies } from 'react-cookie';
import Banner from '../components/Banner';
import useResizeAware from 'react-resize-aware'

// styled Badge for the cart icon
const CartBadge = withStyles(({
    badge: {
      backgroundColor: "#F9CE1D",
      color: "white"
    }
  }))(Badge);

/**
 * Renders the NavBar used to navigate the website
 * 
 * @param {any} props - props for the NavBar to use
 * @returns {HTMLElement} - The NavBar
 */
export default function NavBar(props) {

    const MAX_MOBILE_RENDER = 768; // exclusive 

    {/* history hook to redirect on logout */ }
    const history = useHistory();
    const [cookies, setCookie] = useCookies(["cart"]);
    const [resizeListener, sizes] = useResizeAware();
    const [state, setState] = React.useState({
        isUserAuthenticated: false
    });

    {/* stores class names to toggle whether content is shown */ }
    var adminContentClass;
    var loginButtonClass;

    {/* removes login token and redirects to menu page */ }
    function Logout() {
        history.push("/login");
        history.go(0);
    }

    /**
     * Renders the cart, redirecting to the menu page if the user is not on it already. 
     */
    function goToMenuPageAndOpenCart(){

        // mobile view
        if(window.innerWidth < MAX_MOBILE_RENDER){
            history.push("/cart");
        // non-mobile & already on menu page
        } else if(window.location.pathname === "/"){
            props.toggleCart()
        // non-mobile & not on menu page
        } else {
            history.push({
                pathname: '/',
                state: {toggleCart: true} // data passed to menu to signify it should toggle its cart
            })
        }
    }

    /**
     * Change the navbar height state so that banner moves down naturally
     */
    

    useEffect(() => {
        isAuthenticated().then(async result => {
            if (!result) {
                logout();
            }
            setState({ ...state, isUserAuthenticated: result });
        })
    }, []);

    {/* Hides admin content (admin page + logout) or login button depending on whether user is logged in */ }
    if (state.isUserAuthenticated) {
        adminContentClass = "nav-link";
        loginButtonClass = "nav-link d-none";
    } else {
        adminContentClass = "nav-link d-none";
        loginButtonClass = "nav-link";
    }

    {/* Check current page from props to change active nav-link color */ }
    function isPageActive(pageToCheck) {
        return (pageToCheck === window.location.pathname) ? " active" : "";
    }

    return (
        <html>
            <head>
                {/* Bootstrap Resources */}
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossOrigin="anonymous" />
            </head>
            {/* Left Hand Side of Navbar - Title & Image linked to Menu Page */}
            <Navbar className="navbar navbar-bg-color" collapseOnSelect expand="xl" variant="dark">
                {/** Tracks navbar size, used to make sure that banner overlap does not occur on mobile toggle */}
                {resizeListener}
                
                {/* Left Hand Side of Navbar - Title & Image linked to Menu Page */}
                <Navbar.Brand href="/">
                    <span>
                        <img src={Logo} className="logo-img" alt="UWEAST Logo" width={'90'} 
                            height={'90'} />
                    </span>

                    {/* Text to complement the logo */}
                    <div className="brand-name" >
                        <p>Baraka & Bilal Catering</p>
                    </div>

                </Navbar.Brand>

                {/* The shopping cart will only render if it is a mobile component */}
                <div className="cart-icon-container">
                    {
                        <div className="cart-icon">
                            <IconButton onClick={goToMenuPageAndOpenCart}>
                                <CartBadge badgeContent={(props.itemCount) ? props.itemCount : cookies.cart.items.length}>
                                    <FontAwesomeIcon icon={faShoppingCart} style={{ color: 'white' }}/>
                                </CartBadge>
                            </IconButton>
                        </div>
                    }

                    {/* Triggers on Collapse - Hamburger Icon replaces pages */}
                    <Navbar.Toggle style={{border: '1px solid white', marginLeft: 'calc(7vw)'}}/>
                </div>

                {/* Right Hand Side of Navbar - Linked Pages (based off of Router paths in App.js) */}
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ml-auto">
                        {/* Menu Page */}
                        <Nav.Link className={"nav-link" + isPageActive("/")} href="/">Menu</Nav.Link>

                        {/* Contact Page */}
                        <Nav.Link className={"nav-link" + isPageActive("/contact")} href="/contact">Contact</Nav.Link>

                        {/* About Page */}
                        <Nav.Link className={"nav-link" + isPageActive("/about")} href="/about">About</Nav.Link>

                        {/* Admin Page */}
                        <span className="desktop-tabs">
                            <Nav.Link className={adminContentClass + isPageActive("/admin")} href="/admin">Admin</Nav.Link>
                        </span>

                        {/* Logout */}
                        <span className="desktop-tabs">
                            <Nav.Link className={adminContentClass} onClick={Logout}>Logout</Nav.Link>
                        </span>

                        {/* Login */}
                        <span className="desktop-tabs">
                            <Nav.Link className={loginButtonClass + isPageActive("/login")} href="/login">Login</Nav.Link>
                        </span>
                    </Nav>
                </Navbar.Collapse>

                {/* The shopping cart will only render for smaller desktop screens/tablets */}
                {
                    <div className="cart-icon-smaller-desktop">
                        <IconButton onClick={() => goToMenuPageAndOpenCart()}>
                            <CartBadge badgeContent={(props.itemCount) ? props.itemCount : cookies.cart.items.length}>
                                <FontAwesomeIcon icon={faShoppingCart} style={{ color: 'white' }}/>
                            </CartBadge>
                        </IconButton>
                    </div>
                }
            </Navbar>
            {props.page === "home" ? <Banner navbarHeight={sizes.height} /> : null}
            
        </html>
    )
}
