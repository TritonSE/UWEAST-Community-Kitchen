/**
 * The file is responsible for the display and functionality of login, allowing a registered user
 * to be authenticated provided they give the correct email and password. For all other attempts,
 * login is blocked with some error message as indication. Upon successful verification of user, the
 * user is given an JWT admin token that will allow them administration functionality on the site,
 * namely access to the site's Admin page.
 *
 * @summary     Displays login page and allows registed user to login as a site admin.
 * @author      Amrit Kaur Singh
 */

import React, { useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { TextField, Button, Snackbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import DOMPurify from "dompurify";
import Navbar from "../components/NavBar";
import { isAuthenticated, setJWT } from "../util/Auth";

import "../css/AccountsPages.css";

const config = require("../config");

const BACKEND_URL = config.backend.uri;

const useStyles = makeStyles((theme) => ({
  centered: {
    textAlign: "center",
  },
  form: {
    // input field - general layout
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "95%",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "black",
    },
    "& .MuiTypography-root": {
      margin: theme.spacing(1),
      width: "100%",
    },

    "& .MuiButton-root": {
      margin: theme.spacing(3),
      color: "black",
      background: "#F9CE1D",
      width: "30%",
    },
  },
  title: {
    margin: theme.spacing(2),
    textAlign: "center",
    fontWeight: "bolder",
    textTransform: "uppercase",
  },
}));

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    isAuthenticatingUser: true,
    isUserAuthenticated: false,
    email: "",
    password: "",
    showPassword: false,
    snack: {
      message: "",
      open: false,
    },
    errors: {
      email: false,
      password: false,
    },
    form_disabled: false,
  });

  // checks if user is already authenticated (logged in)
  useEffect(() => {
    isAuthenticated().then(async (result) => {
      setState({ ...state, isAuthenticatingUser: false, isUserAuthenticated: result });
    });
  }, []);

  // updates given state with given value
  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword });
  };

  /**
   * Handles submission of the form (button click). Validates form data for completion/length, making a backend request to Users Collection for user authentication. If
   * user is authenticated, user is redirected to admin page and given a special admin JWT. Otherwise, an error message appears.
   *
   * @param {*} event - Reason for function call
   * @returns {void}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // check if cookies are disabled
    if (!navigator.cookieEnabled) {
      setState({
        ...state,
        snack: {
          message: "Please enable your cookies and reload the page to access login functionality.",
          open: true,
        },
      });
      return;
    }

    // temporarily disable form to prevent spam clicks
    setState({ ...state, form_disabled: true });

    // display loading cursor
    document.body.style.cursor = "wait";

    // sanitize input - XSS attack protection
    state.email = DOMPurify.sanitize(state.email);
    state.password = DOMPurify.sanitize(state.password);

    const submission = {
      email: state.email,
      password: state.password,
    };

    // check if either field is empty
    let email = false;
    let password = false;

    if (state.email === "") {
      email = true;
    }
    if (state.password === "") {
      password = true;
    }
    if (email + password > 0) {
      document.body.style.cursor = null;
      setState({
        ...state,
        errors: { email, password },
        form_disabled: false,
        snack: { message: "Please fill out all required fields.", open: true },
      });
      return;
    }

    // check password length
    if (submission.password.length < 6) {
      document.body.style.cursor = null;
      setState({
        ...state,
        errors: { email: false, password: true },
        form_disabled: false,
        snack: { message: "Password must be at least 6 characters long.", open: true },
      });
      return;
    }
    try {
      // attempt to login with given credentials
      const response = await fetch(`${BACKEND_URL}user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      // successful login
      if (response.ok) {
        // set admin JWT
        const json = await response.json();
        setJWT(json.token);
        document.body.style.cursor = null;
        // admin redirect
        history.push("/admin");
        return;
      }
      // invalid credentials
      if (response.status === 401) {
        document.body.style.cursor = null;
        setState({
          ...state,
          errors: { email: true, password: true },
          form_disabled: false,
          snack: { message: "Invalid Login: Email or password not recognized.", open: true },
        });
      }
      // any other server response
      else {
        const text = await response.text();
        document.body.style.cursor = null;
        setState({
          ...state,
          form_disabled: false,
          errors: { email: false, password: false },
          snack: { message: `Could not log in: ${text}`, open: true },
        });
      }
    } catch (error) {
      // general error
      document.body.style.cursor = null;
      setState({
        ...state,
        form_disabled: false,
        errors: { email: false, password: false },
        snack: { message: `An error occurred: ${error.message}`, open: true },
      });
    }
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({ ...state, snack: { ...state.snack, open: false } });
  };

  // loading screen while user is being authenticated (prevent double logins)
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

    // authenticated user, redirect to admin
  }
  if (state.isUserAuthenticated) {
    return <Redirect to="/admin" />;
    // non-authenticated user, display login page
  }
  return (
    <html className="Account-Html">
      <body className="Account-Body">
        {/* navbar */}
        <div className="NavBar">
          <Navbar />
        </div>
        <div className="Account-Box">
          <div className="Border">
            {/* title + description  */}
            <Typography variant="h4" className={classes.title} style={{ fontSize: "2.5rem" }}>
              {" "}
              Login{" "}
            </Typography>
            <p className={classes.centered} style={{ color: "#8d8d8d" }}>
              {" "}
              Sign-in into an existing account below{" "}
            </p>
            {/* form  */}
            <form className={classes.form} onSubmit={handleSubmit}>
              {/* email field */}
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                onChange={handleChange("email")}
                error={state.errors.email}
              />
              {/* password field */}
              <TextField
                label="Password"
                variant="outlined"
                type={state.showPassword ? "text" : "password"}
                onChange={handleChange("password")}
                error={state.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        {state.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {/* registration link */}
              <Link to="register">
                <Typography>Register Account</Typography>
              </Link>
              {/* reset password link */}
              <Link to="reset-password">
                <Typography>Reset Password</Typography>
              </Link>
              {/* login button */}
              <div className={classes.centered}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={state.form_disabled}
                >
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </body>
      {/* error messages displayed at bottom of screen */}
      <Snackbar
        open={state.snack.open}
        autoHideDuration={6000}
        onClose={handleSnackClose}
        message={state.snack.message}
      />
    </html>
  );
}
