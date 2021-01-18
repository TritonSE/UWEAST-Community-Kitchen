import React, { Component} from 'react';
import '../css/NavBar.css';
import { useHistory } from 'react-router-dom';
import { isAuthenticated, logout} from '../util/auth';

export default function NavBar() {

    const history = useHistory();

    const handleLogout = async () => {
        logout();
        //history.push("/login");
    }

    //Admin User
    if (isAuthenticated()){

        return (

            <html>
                <head>
                    {/* NavBar Formatting for aesthetics*/}
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"/>
            
            
                    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
                    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
                    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
                </head>
                <body>
                    
                    <nav class="navbar navbar-dark bg-dark navbar-toggleable-md navbar-expand-md" id="commRollover">
                        {/* Left Hand Side of NavBar - Title & Image linked to Menu Page */}
                        <a class="navbar-brand" href="/">
                            <img src="" alt="UWEAST"/>
                        </a>
            
                        {/* Triggers on Collapse - Hamburger Icon replaces pages */}
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false">
                            <span class="navbar-toggler-icon"></span>
                        </button>
            
                        {/* Right Hand Side of NavBar - Linked Pages (based off of Router paths in App.js) */}
                        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                            <ul class="navbar-nav">
                                {/* Menu Page */}
                                <li class="nav-item">
                                    <a class="nav-link" href="/">Menu</a>
                                </li>
                                {/* About Page */}
                                <li class="nav-item">
                                    <a class="nav-link" href="/about">About</a>
                                </li>
                                {/* Contact Page */}
                                <li class="nav-item">
                                    <a class="nav-link" href="/contact">Contact</a>
                                </li>
                                {/* Admin Page */}
                                <li class="nav-item">
                                    <a class="nav-link" href="/admin">Admin</a>
                                </li>
                                {/* Login Page */}
                                <li class="nav-item">
                                    <a class="nav-link" href="/login" onClick={handleLogout}>Logout</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </body>
            </html>
    
          )
    //Regular User
    } else {
        return (

            <html>
                <head>
                    {/* NavBar Formatting for aesthetics*/}
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"/>
            
            
                    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
                    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
                    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
                </head>
                <body>
                    
                    <nav class="navbar navbar-dark bg-dark navbar-toggleable-md navbar-expand-md" id="commRollover">
                        {/* Left Hand Side of NavBar - Title & Image linked to Menu Page */}
                        <a class="navbar-brand" href="/">
                            <img src="" alt="UWEAST"/>
                        </a>
            
                        {/* Triggers on Collapse - Hamburger Icon replaces pages */}
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false">
                            <span class="navbar-toggler-icon"></span>
                        </button>
            
                        {/* Right Hand Side of NavBar - Linked Pages (based off of Router paths in App.js) */}
                        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                            <ul class="navbar-nav">
                                {/* Menu Page */}
                                <li class="nav-item">
                                    <a class="nav-link" href="/">Menu</a>
                                </li>
                                {/* About Page */}
                                <li class="nav-item">
                                    <a class="nav-link" href="/about">About</a>
                                </li>
                                {/* Contact Page */}
                                <li class="nav-item">
                                    <a class="nav-link" href="/contact">Contact</a>
                                </li>
                                {/* Login Page */}
                                <li class="nav-item">
                                    <a class="nav-link" href="/login">Login</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </body>
            </html>
    
          )
        }
  }