/**
 * This renders the modal that displays a form of editable
 * fields for the order, including customer contact information,
 * pickup, and any order notes for internal admin use. However, aside for
 * checking for empty fields, it does not do any sort of validation
 * on input, assuming fields are correct (especially email field).
 *
 * It also only renders when the pen icon is clicked
 * on the toolbar.
 *
 * @summary     Allows for order editing (to a degree).
 * @author      Amrit Kaur Singh
 */

import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FormControl, OutlinedInput, Snackbar } from "@material-ui/core";

import { getJWT, logout } from "../util/Auth";
import "../css/Orders.css";

const config = require("../config");

const BACKEND_URL = config.backend.uri;

export default function EditOrder(props) {
  // formats the pickup date string so its readable by the form field
  function formatPickUpString(s) {
    s = s.split("\n");
    let d = s[0].split("/");
    const t = s[1].split(":");
    const suffix = t[1].split(" ");
    if (suffix[1] === "P.M.") {
      t[0] = parseInt(t[0]) + 12;
    }
    t[0] = t[0].length === 1 ? `0${t[0]}` : t[0]; // hours
    d[0] = d[0].length === 1 ? `0${d[0]}` : d[0]; // month
    d[1] = d[1].length === 1 ? `0${d[1]}` : d[1]; // day
    d = `${d[2]}-${d[0]}-${d[1]}T${t[0]}:${suffix[0]}`;

    return d;
  }

  const [showModal, setShow] = useState(false);

  // if true disables the both buttons
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [state, setState] = useState({
    name: props.data[2],
    email: props.data[3],
    number: props.data[4],
    pickup: formatPickUpString(props.data[1]),
    note: props.data[11],
    snack: {
      message: "",
      open: false,
    },
    errors: {
      name: false,
      email: false,
      number: false,
    },
  });

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.value });
  };

  // sets the modal when component initially renders
  useEffect(() => {
    setShow(props.show);
    // set form information with the clicked order
    setState({
      name: props.data[2],
      email: props.data[3],
      number: props.data[4],
      pickup: formatPickUpString(props.data[1]),
      note: props.data[11],
      snack: {
        message: "",
        open: false,
      },
      errors: {
        name: false,
        email: false,
        number: false,
      },
    });
  }, [props]);

  // hides the edit order modal
  const hideModal = () => {
    setShow(false);
    props.updateParentShow(false);
  };

  // hides snackbar
  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({ ...state, snack: { ...state.snack, open: false } });
  };

  // saves the order edits to the database
  const saveEditingChanges = () => {
    // disable button to prevent spam clicks
    setButtonDisabled(true);

    // loading cursor to indicate to user they have to wait
    document.body.style.cursor = "wait";

    let nameErr = false;
    let emailErr = false;
    let phoneErr = false;

    // validate for non-empty inputs
    if (state.name.trim() === "") {
      nameErr = true;
    }
    if (state.email.trim() === "") {
      emailErr = true;
    }
    if (state.number.trim() === "") {
      phoneErr = true;
    }

    // return and display error if any fields are empty
    if (nameErr || emailErr || phoneErr) {
      document.body.style.cursor = null;
      setButtonDisabled(false);
      setState({
        ...state,
        snack: { message: "Field(s) cannot be empty", open: true },
        errors: { name: nameErr, email: emailErr, number: phoneErr },
      });
      return;
    }

    // make backend call
    fetch(`${BACKEND_URL}order/editOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: getJWT(), // string
        _id: props.data[10], // string
        Customer: {
          Name: state.name.trim(),
          Email: state.email.trim(),
          Phone: state.number.trim(),
        },
        Pickup: state.pickup,
        Notes: state.note.trim(),
      }),
    })
      .then((res) => {
        // worked
        if (res.status === 200) {
          document.body.style.cursor = null;
          setButtonDisabled(false);
          // reset to initial states
          props.error(true, "Edits Successfuly Saved");
          hideModal();
          props.setSelectedRows([]);
          props.render();
        }
        // invalid admin token
        else if (res.status === 401) {
          document.body.style.cursor = null;
          setButtonDisabled(false);
          logout();
          // refresh will cause a redirect to login page
          window.location.reload();
        }

        // order could not be deleted
        else if (res.status >= 400) {
          document.body.style.cursor = null;
          setButtonDisabled(false);
          // renders the error message
          props.error(true, "Error! Could not Save Changes");
          hideModal();
          props.setSelectedRows([]);
          props.render();
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {/* The delete order modal that renders when the trash can icon is clicked */}
      <Modal show={showModal} onHide={(e) => hideModal()} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Order</Modal.Title>
        </Modal.Header>
        {/* The modal body */}
        <Modal.Body>
          <div>
            {/* The checkboxes for the deletion modal */}
            <form className="delete-order-form">
              {/* customer name */}
              <p className="formLabelText">Name </p>
              <FormControl margin="dense">
                <OutlinedInput
                  id="name"
                  error={state.errors.name}
                  value={state.name}
                  onChange={handleChange("name")}
                  size="small"
                />
              </FormControl>
              {/* customer email */}
              <p className="formLabelText">Email </p>
              <FormControl margin="dense">
                <OutlinedInput
                  id="email"
                  error={state.errors.email}
                  value={state.email}
                  onChange={handleChange("email")}
                  size="small"
                  type="email"
                />
              </FormControl>
              {/* customer number */}
              <p className="formLabelText">Phone Number </p>
              <FormControl margin="dense">
                <OutlinedInput
                  id="number"
                  error={state.errors.number}
                  value={state.number}
                  onChange={handleChange("number")}
                  size="small"
                  type="tel"
                />
              </FormControl>
              {/* customer pick up */}
              <p className="formLabelText">Pick-Up </p>
              <FormControl margin="dense">
                <OutlinedInput
                  id="pickup"
                  value={state.pickup}
                  onChange={handleChange("pickup")}
                  size="small"
                  type="datetime-local"
                />
              </FormControl>
              {/* customer notes */}
              <p className="formLabelText"> Notes </p>
              <FormControl margin="dense">
                <OutlinedInput
                  id="note"
                  value={state.note}
                  onChange={handleChange("note")}
                  size="small"
                  multiline
                  rows={5}
                />
              </FormControl>
            </form>
            {/* note at bottom  */}
            <span>
              <p className="note-paypal">
                {" "}
                <span style={{ color: "red" }}> *</span> Verify the email and phone number are
                correct!
              </p>
            </span>
          </div>
        </Modal.Body>

        {/* The buttons at the bottom of the modal */}
        <Modal.Footer>
          <Button
            variant="primary"
            className="menuAddButton"
            onClick={() => saveEditingChanges()}
            disabled={buttonDisabled}
          >
            Save Changes
          </Button>
          <Button variant="secondary" onClick={() => hideModal()} disabled={buttonDisabled}>
            Cancel
          </Button>
        </Modal.Footer>
        {/* error messages displayed at bottom of screen */}
        <Snackbar
          open={state.snack.open}
          autoHideDuration={6000}
          onClose={handleSnackClose}
          message={state.snack.message}
        />
      </Modal>
    </div>
  );
}
