/**
 * This renders the "change primary email" portion of
 * the "emails" tab under the "Admin" page.
 *
 * @summary     Handles changing primary email functionality.
 * @author      Amitesh Sharma
 */

import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import { getJWT, logout } from "../util/Auth";

import "../css/ChangeEmailScreen.css";

const config = require("../config");

const BACKEND_URL = config.backend.uri;

// styling used for the textfield outline
const useStyles = makeStyles((theme) => ({
  span: {
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "black",
    },
  },
}));

export default function ChangeEmailScreen(props) {
  const classes = useStyles();
  const [inputEmail, setPrimaryEmail] = useState("");
  const [secondaryEmails, setSecondaryEmails] = useState([]);
  const [primaryEmail, updateStatePrimaryEmail] = useState("");
  const [inputError, setInputError] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // catch enter rerendeing entire admin page
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleFormSubmit(inputEmail, setInputError, setOpen);
    }
  };

  // sets some state variables when page loads
  useEffect(() => {
    setSecondaryEmails(props.emails);
    updateStatePrimaryEmail(props.primaryEmail);
  }, [props]);

  /**
   * Updates the primary email in the database.
   *
   * @param {string} email - Primary email to update
   * @param {function} setInputError - Error handling
   * @param {function} setOpen - Snackbox rendering
   */
  async function handleFormSubmit(email, setInputError, setOpen) {
    // make sure it is not a secondary email
    if (secondaryEmails.includes(email)) {
      setInputError(true);
      setErrorMessage("This email is already listed as a secondary email.");
      return;
    }

    // check for empty string
    if (email.length === 0) {
      setInputError(true);
      setErrorMessage("Enter a valid email address.");
      return;
    }

    // validate to make sure email is an email
    if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setInputError(true);
      setErrorMessage("Enter a valid email address.");
      return;
    }

    // change the primary email backend call
    await fetch(`${BACKEND_URL}email/changePrimary`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        token: getJWT(),
      }),
    }).then((res) => {
      if (res.ok) {
        // clear any textfields and reset all states
        setInputError(false);
        setOpen(true);
        setPrimaryEmail("");
        setErrorMessage("");
        props.updatePrimaryEmail(email);
      }
      // invalid admin token
      else if (res.status === 401) {
        logout();
        // refresh will cause a redirect to login page
        window.location.reload();
      } else {
        setErrorMessage("This is currently your primary email.");
        setInputError(true);
      }
    });
  }

  return (
    <div>
      <br />
      <h1 className="emailHeading">Change Primary Email</h1>
      <p className="emailDescription">
        Order confirmations/cancellations and customer inquiries will be sent to this email.
      </p>

      {/* Contains the current primary email */}
      <span>
        <TextField
          id="primary-email-disabled"
          size="small"
          value={primaryEmail}
          type="email"
          variant="outlined"
          disabled
        />
      </span>

      <br />
      <br />
      {/* Textfield that is used to update the primary email */}
      <span className={classes.span}>
        <TextField
          size="small"
          error={inputError}
          value={inputEmail}
          type="email"
          id="emailUpdateInput"
          onChange={(e) => setPrimaryEmail(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          label="Primary Email"
          variant="outlined"
          helperText={errorMessage}
          className={classes.form}
        />
      </span>
      <br />
      <br />

      <Button
        id="submit"
        className="emailUpdateButton"
        onClick={() => handleFormSubmit(inputEmail, setInputError, setOpen)}
      >
        Update
      </Button>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={(e) => setOpen(false)}
        message="Email updated successfully!"
      />
    </div>
  );
}
