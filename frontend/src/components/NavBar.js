import React from 'react';
import { useHistory } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import { isAuthorized, removeJWT } from '../util/auth.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import Logo from "../util/UWEAST_Logo_Detail_Transparent.png";
import '../css/NavBar.css';


export default function NavBar (props) {

    {/* history hook to redirect on logout */}
    const history = useHistory();

    {/* stores class names to toggle whether content is shown */}
    var adminContentClass;
    var loginButtonClass;

    {/* removes login token and redirects to menu page */}
    function logout() {
        removeJWT();
        history.push("/");
        history.go(0);
    }

    {/* Hides admin content (admin page + logout) or login button depending on whether user is logged in */}
    if(isAuthorized()) {
        adminContentClass = "nav-link";
        loginButtonClass = "nav-link d-none";
    } else {
        adminContentClass = "nav-link d-none";
        loginButtonClass = "nav-link";
    }

    {/* Check current page from props to change active nav-link color */}
    function isPageActive(pageToCheck) {
        return (pageToCheck === props.currentPage) ? " active" : "";
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

                {/* The shopping cart will only render if it is a mobile component */}
                <div className="cart-icon">
                    <FontAwesomeIcon icon={faShoppingCart} style={{ color: 'white' }} 
                        onClick={() => console.log('clicked')} />
                </div>

                {/* Triggers on Collapse - Hamburger Icon replaces pages */}
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                {/* Right Hand Side of Navbar - Linked Pages (based off of Router paths in App.js) */}
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ml-auto">
                        {/* Menu Page */}
                        <Nav.Link className={"nav-link" + isPageActive("menu")} href="/">Menu</Nav.Link>

                        {/* Contact Page */}
                        <Nav.Link className={"nav-link" + isPageActive("contact")} href="/contact">Contact</Nav.Link>

                        {/* About Page */}
                        <Nav.Link className={"nav-link" + isPageActive("about")} href="/about">About</Nav.Link>

                        <span className="desktop-tabs">
                            <Nav.Link className={adminContentClass + isPageActive("admin")} href="/admin">Admin</Nav.Link>
                        </span>

                        <span className="desktop-tabs">
                            <Nav.Link className={adminContentClass + isPageActive("admin")} href="/orders">Orders</Nav.Link>
                        </span>

                        <span className="desktop-tabs">
                            <Nav.Link className={adminContentClass} onClick={logout}>Logout</Nav.Link>
                        </span>

                        <span className="desktop-tabs">
                            <Nav.Link className={loginButtonClass + isPageActive("login")} href="/login">Login</Nav.Link> 
                        </span>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </html>
    )
}