/**
 * The file is responsible for the display and functionality of admin account registration, allowing
 * a non-registered user to make an admin account for themselves provided they have the necessary clearance.
 * Account registration is constrained to unique email addresses (i.e., each email address can have at most one
 * admin account associated with it), and knowledge of the secret key. Secret key has been pre-decided by the
 * cliet, and is confident to them.
 *
 * Successful registration attempts will give the user a special admin JWT so they do not need to re-sign in,
 * and redirect them to the admin page. Unsuccessful registration attempts will spew error messages.
 *
 * Once registration is successful, any subsequent attempts to access the site as an admin must be done
 * using the login page.
 *
 * Note: A logged in user will not have access to the registeration page, as they are assumed to already have a account.
 *
 * @summary     Displays registeration page and allows new user to register as a site admin.
 * @author      Amrit Kaur Singh
 */

import React, { useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { TextField, Button, Grid, Snackbar, Typography } from "@material-ui/core";
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

export default function Register() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    isAuthenticatingUser: true,
    isUserAuthenticated: false,
    email: "",
    password: "",
    passwordConfirmation: "",
    secret: "",
    showPassword: {
      password: false,
      passwordConfirmation: false,
      secret: false,
    },
    snack: {
      message: "",
      open: false,
    },
    errors: {
      email: false,
      password: false,
      passwordConfirmation: false,
      secret: false,
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
    setState({
      ...state,
      showPassword: { ...state.showPassword, password: !state.showPassword.password },
    });
  };

  const handleClickShowPasswordConfirmation = () => {
    setState({
      ...state,
      showPassword: {
        ...state.showPassword,
        passwordConfirmation: !state.showPassword.passwordConfirmation,
      },
    });
  };

  const handleClickShowSecret = () => {
    setState({
      ...state,
      showPassword: { ...state.showPassword, secret: !state.showPassword.secret },
    });
  };

  /**
   * Handles submission of the form (button click). Validates form data for completion/length, making a backend request to Users DB for secret key autentication +
   * email uniqueness. If registeration succeeds, user is redirected to admin page and added to user collection. Otherwise, an error message appears.
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
          message:
            "Please enable your cookies and reload the page to access registeration functionality.",
          open: true,
        },
      });
      return;
    }

    setState({ ...state, form_disabled: true });

    // display loading cursor
    document.body.style.cursor = "wait";

    // sanitize input - XSS attack protection
    state.email = DOMPurify.sanitize(state.email);
    state.password = DOMPurify.sanitize(state.password);
    state.passwordConfirmation = DOMPurify.sanitize(state.passwordConfirmation);
    state.secret = DOMPurify.sanitize(state.secret);

    const submission = {
      email: state.email,
      password: state.password,
      secret: state.secret,
    };

    let email = false;
    let password = false;
    let passwordConfirmation = false;
    let secret = false;

    // check if either field is empty
    if (state.email === "") {
      email = true;
    }
    if (state.password === "") {
      password = true;
    }
    if (state.passwordConfirmation === "") {
      passwordConfirmation = true;
    }
    if (state.secret === "") {
      secret = true;
    }
    if (email + password + passwordConfirmation + secret > 0) {
      document.body.style.cursor = null;
      setState({
        ...state,
        errors: {
          email,
          password,
          passwordConfirmation,
          secret,
        },
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
        errors: { email: false, password: true, passwordConfirmation: false, secret: false },
        form_disabled: false,
        snack: { message: "Password must be at least 6 characters long.", open: true },
      });
      return;
    }

    // check passwords match
    if (state.password !== state.passwordConfirmation) {
      document.body.style.cursor = null;
      setState({
        ...state,
        errors: { email: false, password: true, passwordConfirmation: true, secret: false },
        form_disabled: false,
        snack: { message: "Passwords Do Not Match.", open: true },
      });
      return;
    }

    try {
      // attempt to register with given credentials
      const response = await fetch(`${BACKEND_URL}user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      // successful registration
      if (response.ok) {
        document.body.style.cursor = null;
        const json = await response.json();
        setJWT(json.token);
        history.push("/admin");
        return;
      }
      // invalid credentials
      if (response.status === 401) {
        document.body.style.cursor = null;
        setState({
          ...state,
          errors: { email: false, password: false, passwordConfirmation: false, secret: true },
          form_disabled: false,
          snack: { message: "Could not register account: Invalid Secret Key!", open: true },
        });
      }
      // duplicate user
      else if (response.status === 409) {
        document.body.style.cursor = null;
        setState({
          ...state,
          form_disabled: false,
          errors: { email: true, password: false, passwordConfirmation: false, secret: false },
          snack: { message: "Could not register account: Email already in use!", open: true },
        });
      }
      // any other server response
      else {
        document.body.style.cursor = null;
        const text = await response.text();
        setState({
          ...state,
          errors: { email: false, password: false, passwordConfirmation: false, secret: false },
          form_disabled: false,
          snack: { message: `Could not register account: ${text}`, open: true },
        });
      }
    } catch (error) {
      // general error
      document.body.style.cursor = null;
      setState({
        ...state,
        errors: { email: false, password: false, passwordConfirmation: false, secret: false },
        form_disabled: false,
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

    // non-authenticated user, display registeration page
  }
  return (
    <html className="Account-Html">
      <body className="Account-Body">
        {/* navbar */}
        <div className="NavBar">
          <Navbar />
        </div>
        <Grid container spacing={0} alignItems="center" justify="center" className="Account-Box">
          <Grid item md={6} xs={12}>
            <div className="Border">
              {/* title + description  */}
              <Typography variant="h4" className={classes.title}>
                Register New Account
              </Typography>
              <p className={classes.centered} style={{ color: "#8d8d8d" }}>
                {" "}
                Fill out the fields below to create a new account{" "}
              </p>
              {/* form  */}
              <form className={classes.form} onSubmit={handleSubmit}>
                {/* email field  */}
                <TextField
                  label="Email"
                  variant="outlined"
                  type="email"
                  onChange={handleChange("email")}
                  error={state.errors.email}
                />
                {/* password field  */}
                <TextField
                  label="Password"
                  variant="outlined"
                  type={state.showPassword.password ? "text" : "password"}
                  onChange={handleChange("password")}
                  error={state.errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                        >
                          {state.showPassword.password ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {/* confirm password field  */}
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  type={state.showPassword.passwordConfirmation ? "text" : "password"}
                  onChange={handleChange("passwordConfirmation")}
                  error={state.errors.passwordConfirmation}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPasswordConfirmation}
                        >
                          {state.showPassword.passwordConfirmation ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {/* secret key field  */}
                <TextField
                  label="Secret Key"
                  variant="outlined"
                  type={state.showPassword.secret ? "text" : "password"}
                  onChange={handleChange("secret")}
                  error={state.errors.secret}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowSecret}
                        >
                          {state.showPassword.secret ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {/* login link  */}
                <Link to="login">
                  <Typography>Already have an account? Sign-In</Typography>
                </Link>
                {/* register button  */}
                <div className={classes.centered}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={state.form_disabled}
                  >
                    Register
                  </Button>
                </div>
              </form>
            </div>
          </Grid>
        </Grid>
        {/* error messages displayed at bottom of screen */}
        <Snackbar
          open={state.snack.open}
          autoHideDuration={6000}
          onClose={handleSnackClose}
          message={state.snack.message}
        />
      </body>
    </html>
  );
}
