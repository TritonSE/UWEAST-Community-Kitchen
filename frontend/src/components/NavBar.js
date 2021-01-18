import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import {isAuthorized, removeJWT} from '../util/auth.js';
import '../css/NavBar.css';


export default function NavBar (props) {

    {/* history hook to redirect on logout */}
    const history = useHistory("react-dom-router");

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
        adminContentClass = "px-3";
        loginButtonClass = "px-3 d-none";
    } else {
        adminContentClass = "px-3 d-none";
        loginButtonClass = "px-3";
    }

    return (
        <html>
            <head>
                {/* Bootstrap Resources */}
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"/>
            </head>
            <Navbar className="navbar-bg-color" collapseOnSelect expand="md" variant="dark">
                {/* Left Hand Side of Navbar - Title & Image linked to Menu Page */}
                <Navbar.Brand href="/">
                    <img src="" className="d-inline-block align-top" alt="UWEAST Logo"/>
                </Navbar.Brand>

                {/* Triggers on Collapse - Hamburger Icon replaces pages */}
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                {/* Right Hand Side of Navbar - Linked Pages (based off of Router paths in App.js) */}
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ml-auto">
                        {/* Menu Page */}
                        <Nav.Link className="px-3" href="/">Menu</Nav.Link>

                        {/* Contact Page */}
                        <Nav.Link className="px-3" href="/contact">Contact</Nav.Link>

                        {/* About Page */}
                        <Nav.Link className="px-3" href="/about">About</Nav.Link>

                        {/* Admin Page - only visible when isAuthorized()*/}
                        <Nav.Link className={adminContentClass} href="/admin">Admin</Nav.Link>

                        {/* Logout Button - starts logout operation, only visible when isAuthorized() */}
                        <Nav.Link className={adminContentClass} onClick={logout}>Logout</Nav.Link>

                        {/* Login Page - only visible when not isAuthorized()*/}
                        <Nav.Link className={loginButtonClass} href="/login">Login</Nav.Link>        
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </html>
    )
}