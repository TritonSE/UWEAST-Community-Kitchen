import React, { Component } from 'react';
import Navbar from '../components/NavBar';
import AdminMenuItems from "../components/AdminMenuItems";
import Orders from "./Orders";
import ChangeEmailScreen from "../components/ChangeEmailScreen";
import { isAuthenticated } from '../util/auth';
import {Redirect} from 'react-router-dom';
import '../css/Admin.css';

class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentScreen: "orders"
        }

        //Admin NavBar binding
        this.adminNavBar = this.adminNavBar.bind(this);
    }

    // Renders the admin page navigation bar between orders, menu, and email screens
    // currentScreen takes values "orders", "menu", and "email"
    adminNavBar(){
        var currentScreen = this.state.currentScreen;
        return(
            <div className="adminNavContainer">
                { currentScreen === "orders" ? 
                    <h2 className="adminNavSelected" onClick={() => this.setState({currentScreen: "orders"})}>
                        All Orders
                    </h2> : 
                    <h2 className="adminNavUnselected" onClick={() => this.setState({currentScreen: "orders"})}>
                        All Orders
                    </h2>
                }
                { currentScreen === "menu" ? 
                    <h2 className="adminNavSelected" onClick={() => this.setState({currentScreen: "menu"})}>
                        Menu Items
                    </h2> : 
                    <h2 className="adminNavUnselected" onClick={() => this.setState({currentScreen: "menu"})}>
                        Menu Items
                    </h2>
                }
                { currentScreen === "email" ? 
                    <h2 className="adminNavSelected" onClick={() => this.setState({currentScreen: "email"})}>
                        Email
                    </h2> : 
                    <h2 className="adminNavUnselected" onClick={() => this.setState({currentScreen: "email"})}>
                        Email
                    </h2>
                }
                 { currentScreen === "resetPassword" ? 
                    <h2 className="adminNavSelected" onClick={() => this.setState({currentScreen: "resetPassword"})}>
                        Reset Password
                    </h2> : 
                    <h2 className="adminNavUnselected" onClick={() => this.setState({currentScreen: "resetPassword"})}>
                        Reset Password
                    </h2>
                }
            </div>
        );
    }

    render() { 
        //Redirect to login if user is trying to access admin panel without being logged in 
      return !isAuthenticated() ? <Redirect to="/login"/> : (
          <div>
            {/* The navbar on top of the page */}
              <Navbar currentPage="admin"/>

              {/* This is the contents on the admin page */}
              <div class="admin-section">
                    {this.adminNavBar()}

                    {/* <div class="col-12">
                        <h2 class="admin-title">Orders</h2>
                        <p>View placed orders and mark them as fulfilled.</p>
                        <a class="btn btn-primary" href="/orders" role="button">Orders</a>
                    </div> */}
                    {this.state.currentScreen === "orders" && <Orders />}
                    {this.state.currentScreen === "menu" && <AdminMenuItems />}
                    {this.state.currentScreen === "email" && <ChangeEmailScreen />}
                    {this.state.currentScreen === "resetPassword" && <Redirect to="/reset-password"/>}
                </div>       
          </div>

      )
    }
  }
  
  export default Admin;