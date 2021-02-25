/**
 * The NavBar component. Renders at the top of the website and is fixed to the top.
 * Contains all the relevant tabs that route the user to the specified page.
 * Cart Icon is used for the mobile/tablet rendering of the webpage. 
 * 
 * @summary NavBar at the top of each page, used to navigate the website.
 */

import React, {useEffect} from 'react';
import { useHistory } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import Logo from "../media/UWEAST_Logo_Detail_Transparent.png";
import '../css/NavBar.css';
import { isAuthenticated, logout} from '../util/Auth';

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
 * @returns {HTMLElement} - The NavBar
 */
export default function NavBar() {

    {/* history hook to redirect on logout */}
    const history = useHistory();

    const [state, setState] = React.useState({
        isUserAuthenticated: false,
      });
        
    // read and store the items in the cart for the cart icon
    var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    {/* stores class names to toggle whether content is shown */}
    var adminContentClass;
    var loginButtonClass;

    {/* removes login token and redirects to menu page */}
    function Logout() {
        logout();
        history.push("/login");
        history.go(0);
    }

    useEffect(() => {
        isAuthenticated().then(async result => {
          setState({...state, isUserAuthenticated: result});
        })
      }, []);

    {/* Hides admin content (admin page + logout) or login button depending on whether user is logged in */}
    if(state.isUserAuthenticated) {
        adminContentClass = "nav-link";
        loginButtonClass = "nav-link d-none";
    } else {
        adminContentClass = "nav-link d-none";
        loginButtonClass = "nav-link";
    }

    {/* Check current page from props to change active nav-link color */}
    function isPageActive(pageToCheck) {
        return (pageToCheck === window.location.pathname) ? " active" : "";
    }

    return (
        <html>
            <head>
                {/* Bootstrap Resources */}
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossOrigin="anonymous"/>
            </head>
            <Navbar className="navbar navbar-bg-color" collapseOnSelect expand="md" variant="dark">
                
                {/* Left Hand Side of Navbar - Title & Image linked to Menu Page */}
                <Navbar.Brand href="/">
                    <img src={Logo} className="logo-img" alt="UWEAST Logo" width={window.innerWidth > 768 ? '90' : '80'} 
                        height={window.innerWidth > 768 ? '90' : '80'} />
                </Navbar.Brand>

                {/* Text to complement the logo */}
                <div className="brand-name">
                    <p>Community Kitchen</p>
                </div>

                {/* The shopping cart will only render if it is a mobile component */}
                <div className="cart-icon">
                    <IconButton onClick={() => console.log('clicked')}>
                        <CartBadge badgeContent={cartItems.length}>
                            <FontAwesomeIcon icon={faShoppingCart} style={{ color: 'white' }}/>
                        </CartBadge>
                    </IconButton>
                </div>

                {/* Triggers on Collapse - Hamburger Icon replaces pages */}
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

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
                <div className="cart-icon-smaller-desktop">
                    <IconButton onClick={() => console.log('clicked')}>
                        <CartBadge badgeContent={cartItems.length}>
                            <FontAwesomeIcon icon={faShoppingCart} style={{ color: 'white' }}/>
                        </CartBadge>
                    </IconButton>
                </div>
            </Navbar>
        </html>
    )
}
