import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import '../css/NavBar.css';
import {isAuthorized, removeJWT} from '../util/auth.js';

export default function NavBar (props) {

    {/* store class names of navlist as a state to toggle display when in mobile */}
    const [navListClass, setNavListClass] = useState("nav-list");
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

    {/* Handles toggling of hamburger menu by changing classes for css */}
    function toggleMobileNav() {
        if(navListClass === "nav-list") {
            setNavListClass("nav-list nav-shown");
        } else {
            setNavListClass("nav-list");
        }
    }

    {/* Hides admin content (admin page + logout) or login button depending on whether user is logged in */}
    if(isAuthorized()) {
        adminContentClass = "nav-item";
        loginButtonClass = "nav-item hidden";
    } else {
        adminContentClass = "nav-item hidden";
        loginButtonClass = "nav-item";
    }

    return (
        <div class="navbar">
            {/* Left Hand Side of NavBar - Title & Image linked to Menu Page */}
            <div class="navbar-logo">
                <img src="" alt="UWEAST Logo"></img>
            </div>
            <div class="navbar-nav">
                {/* Triggers on Collapse - Hamburger Icon replaces pages */}
                <a onClick={toggleMobileNav} class="nav-toggler" />

                {/* Right Hand Side of NavBar - Linked Pages (based off of Router paths in App.js) */}
                <ul class={navListClass}>
                    {/* Menu Page */}
                    <li class="nav-item">
                        <a class="nav-link" href="/">Menu</a>
                    </li>
                    {/* Contact Page */}
                    <li class="nav-item">
                        <a class="nav-link" href="/contact">Contact</a>
                    </li>
                    {/* About Page */}
                    <li class="nav-item">
                        <a class="nav-link" href="/about">About</a>
                    </li>
                    {/* Admin Page - only visible when isAuthorized()*/}
                    <li class={adminContentClass}>
                        <a class="nav-link" href="/admin">Admin</a>
                    </li>
                    {/* Logout Button - starts logout operation, only visible when isAuthorized() */}
                    <li class={adminContentClass}>
                        <a class="nav-link" style={{cursor: "pointer"}} onClick={logout}>Logout</a>
                    </li>
                    {/* Login Page - only visible when not isAuthorized()*/}
                    <li class={loginButtonClass}>
                        <a class="nav-link" href="/login">Login</a>
                    </li>
                </ul>
            </div>
        </div>
    )
}