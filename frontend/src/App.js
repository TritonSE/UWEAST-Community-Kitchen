/**
 * The file is responsible for the routing of all pages on the site with a corresponding URL. 
 * 
 * @summary     Routes all URLs to a specific page on the site. 
 * @author      Amrit Kaur Singh
 */

import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { CookiesProvider } from 'react-cookie';
import { withCookies } from 'react-cookie';

import Menu from './pages/Menu';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import CartSummary from './components/CartSummary';
import Custom404 from './pages/Custom404';

function App() {
  return (
    // CookiesProvider allows cookies to be used in any page component
    <CookiesProvider>
      <Router>
        {/* Switch gurantees that a URL can match to only one route*/}
        <Switch>
          {/* Menu Page (Home) */}
         <Route exact path="/">
          <Menu/>
        </Route>
          {/* Login Page */}
          <Route exact path="/login">
            <Login />
          </Route>
          {/* Register Page */}
          <Route exact path="/register">
            <Register />
          </Route>
          {/* Reset Password Page */}
          <Route exact path="/reset-password">
            <ResetPassword />
          </Route>
          {/* About Page */}
        {/* <Route exact path="/about" component={() => { 
          window.location = 'https://www.uweast.org'; 
          return null;
          } }>        
        </Route> */}
        <Route exact path="/about">
          <About/>
        </Route>
          {/* Contact Page */}
          <Route exact path="/contact">
            <Contact />
          </Route>
          {/* Admin Page */}
          <Route exact path="/admin">
            <Admin />
          </Route>
          {/* Cart Summary Page for when screen size is mobile*/}
          <Route exact path="/cart">
            <CartSummary />
          </Route>
          {/* Any other URL is automatically matched to Menu Page */}
          <Route path="/">
            <Custom404/>
          </Route>
        </Switch>
      </Router>
    </CookiesProvider>
  );
}

export default withCookies(App);