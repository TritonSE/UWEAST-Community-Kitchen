import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Menu from './pages/Menu';
import About from './pages/About';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import CartSummary from './components/CartSummary';
import Orders from './pages/Orders';
import { CookiesProvider } from 'react-cookie';
import { withCookies } from 'react-cookie';

function App() {
  return (
    // CookiesProvider allows cookies to be used in any page component
    <CookiesProvider>
    <Router>
      {/* Switch gurantees that a URL can match to only one route*/}
      <Switch>
        {/* Login Page */}
        <Route exact path="/login">
          <Login/>
        </Route>
        {/* Register Page */}
        <Route exact path="/register">
          <Register/>
        </Route>
        {/* Reset Password Page */}
        <Route exact path="/reset-password">
          <ResetPassword/>
        </Route>
        {/* About Page */}
        <Route exact path="/about">
          <About/>
        </Route>
        {/* Contact Page */}
        <Route exact path="/contact">
          <Contact/>
        </Route>
        {/* Admin Page */}
        <Route exact path="/admin">
          <Admin/>
        </Route>
        {/* Cart Summary Page for when screen size is mobile*/}
        <Route exact path="/cart">
          <CartSummary/>
        </Route>
        {/* Any other URL is automatically matched to Menu Page */}
        <Route path="/">
          <Menu/>
        </Route>
      </Switch>
    </Router>
    </CookiesProvider>
  );
}

export default withCookies(App);