import React, { useEffect } from 'react';
import Navbar from '../components/NavBar';
import AdminMenuItems from "../components/AdminMenuItems";
import Orders from "./Orders";
import ChangeEmailScreen from "../components/ChangeEmailScreen";
import { isAuthenticated } from '../util/Auth';
import {Redirect} from 'react-router-dom';
import '../css/Admin.css';

export default function Admin() {

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         currentScreen: "orders"
    //     }

    //     //Admin NavBar binding
    //     this.adminNavBar = this.adminNavBar.bind(this);
    // }

    const [state, setState] = React.useState({
        isAuthenticatingUser: true,
        isUserAuthenticated: false,
        currentScreen: "orders"
      });

    useEffect(() => {
        isAuthenticated().then(async result => {
          setState({ ...state, isAuthenticatingUser: false, isUserAuthenticated: result});
        })
      }, []);

    // Renders the admin page navigation bar between orders, menu, and email screens
    // currentScreen takes values "orders", "menu", and "email"
    const adminNavBar = () => {
        var currentScreen = state.currentScreen;
        return(
            <div className="adminNavContainer">
            <div>
                { currentScreen === "orders" ? 
                    <h2 className="adminNavSelected" onClick={() => setState({...state, currentScreen: "orders"})}>
                        All Orders
                    </h2> : 
                    <h2 className="adminNavUnselected" onClick={() => setState({...state, currentScreen: "orders"})}>
                        All Orders
                    </h2>
                }
                { currentScreen === "menu" ? 
                    <h2 className="adminNavSelected" onClick={() => setState({...state, currentScreen: "menu"})}>
                        Edit Menu
                    </h2> : 
                    <h2 className="adminNavUnselected" onClick={() => setState({...state, currentScreen: "menu"})}>
                        Edit Menu
                    </h2>
                }
                { currentScreen === "email" ? 
                    <h2 className="adminNavSelected" onClick={() => setState({...state, currentScreen: "email"})}>
                        Email
                    </h2> : 
                    <h2 className="adminNavUnselected" onClick={() => setState({...state, currentScreen: "email"})}>
                        Email
                    </h2>
                }
                 { currentScreen === "resetPassword" ? 
                    <h2 className="adminNavSelected" onClick={() => setState({...state, currentScreen: "resetPassword"})}>
                        Reset Password
                    </h2> : 
                    <h2 className="adminNavUnselected" onClick={() => setState({...state, currentScreen: "resetPassword"})}>
                        Reset Password
                    </h2>
                }
                </div>
            </div>
        );
    }

        //Redirect to login if user is trying to access admin panel without being logged in 

        if(state.isAuthenticatingUser){
            return (
                <div>
                    <Navbar/>
                    <p> Authenticating... </p>
                </div>
            );
        }
        else if (!state.isUserAuthenticated){
            return (
                <Redirect to="/login"/> 
            );
        } else {
            return (
                <div>
                {/* The navbar on top of the page */}
                  <Navbar/>
    
                  {/* This is the contents on the admin page */}
                  <div class="admin-section">
                        {adminNavBar()}
    
                        {/* <div class="col-12">
                            <h2 class="admin-title">Orders</h2>
                            <p>View placed orders and mark them as fulfilled.</p>
                            <a class="btn btn-primary" href="/orders" role="button">Orders</a>
                        </div> */}
                        {state.currentScreen === "orders" && <Orders />}
                        {state.currentScreen === "menu" && <AdminMenuItems />}
                        {state.currentScreen === "email" && <ChangeEmailScreen />}
                        {state.currentScreen === "resetPassword" && <Redirect to="/reset-password"/>}
                    </div>       
              </div>
            );
        }
  };