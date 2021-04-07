/**
 * This file contains renders the Admin page. It includes a Nav Bar that links
 * to the orders page, menu page, update emails page, and change passwords page.
 *
 * @summary    Renders admin page
 * @author     PatrickBrown1
 */

import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Navbar from "../components/NavBar";
import AdminMenuItems from "../components/AdminMenuItems";
import Orders from "./Orders";
import Emails from "./Emails";
import { isAuthenticated } from "../util/Auth";

import "../css/Admin.css";
import "../css/AccountsPages.css";

export default function Admin() {
  const [state, setState] = React.useState({
    isAuthenticatingUser: true,
    isUserAuthenticated: false,
    currentScreen: "orders",
  });

  useEffect(() => {
    isAuthenticated().then(async (result) => {
      setState({ ...state, isAuthenticatingUser: false, isUserAuthenticated: result });
    });
  }, []);

  /**
   * Renders the admin page navigation bar between orders, menu, and email screens.
   */
  const adminNavBar = () => {
    const { currentScreen } = state;
    return (
      <div className="adminNavContainer">
        {currentScreen === "orders" ? (
          <h2
            className="adminNavSelected"
            onClick={() => setState({ ...state, currentScreen: "orders" })}
          >
            All Orders
          </h2>
        ) : (
          <h2
            className="adminNavUnselected"
            onClick={() => setState({ ...state, currentScreen: "orders" })}
          >
            All Orders
          </h2>
        )}
        {currentScreen === "menu" ? (
          <h2
            className="adminNavSelected"
            onClick={() => setState({ ...state, currentScreen: "menu" })}
          >
            Edit Menu
          </h2>
        ) : (
          <h2
            className="adminNavUnselected"
            onClick={() => setState({ ...state, currentScreen: "menu" })}
          >
            Edit Menu
          </h2>
        )}
        {currentScreen === "email" ? (
          <h2
            className="adminNavSelected"
            onClick={() => setState({ ...state, currentScreen: "email" })}
          >
            Email
          </h2>
        ) : (
          <h2
            className="adminNavUnselected"
            onClick={() => setState({ ...state, currentScreen: "email" })}
          >
            Email
          </h2>
        )}
        {currentScreen === "resetPassword" ? (
          <h2
            className="adminNavSelected"
            onClick={() => setState({ ...state, currentScreen: "resetPassword" })}
          >
            Reset Password
          </h2>
        ) : (
          <h2
            className="adminNavUnselected"
            onClick={() => setState({ ...state, currentScreen: "resetPassword" })}
          >
            Reset Password
          </h2>
        )}
      </div>
    );
  };

  // redirect to login if user is trying to access admin panel without being logged in
  if (state.isAuthenticatingUser) {
    return (
      <html className="Account-Html">
        <body className="Account-Body">
          <div className="NavBar">
            <Navbar />
          </div>
          <div className="spinner">
            <CircularProgress color="inherit" size={40} />
          </div>
        </body>
      </html>
    );
  }
  if (!state.isUserAuthenticated) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      {/* The navbar on top of the page */}
      <Navbar />

      {/* This is the contents on the admin page */}
      <div className="admin-section">
        {adminNavBar()}
        {state.currentScreen === "orders" && <Orders />}
        {state.currentScreen === "menu" && <AdminMenuItems />}
        {state.currentScreen === "email" && <Emails />}
        {state.currentScreen === "resetPassword" && <Redirect to="/reset-password" />}
      </div>
    </div>
  );
}
