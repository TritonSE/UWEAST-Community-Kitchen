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
import Orders from './pages/Orders';

function App() {
  return (
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
        {/* Orders page */}
        <Route exact path="/orders">
          <Orders />
        </Route>
        {/* Any other URL is automatically matched to Menu Page */}
        <Route path="/">
          <Menu/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;