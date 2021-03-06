/**
 * Modal used to change the header image of the Menu page. The modal renders
 * whenever the "Change Header" button from AdminMenuItems.js is clicked. It
 * contains a simple form used to update the URL of the header image of the
 * Menu page.
 *
 * An error is thrown if and only if the "Image Link" field is empty.
 *
 * Note: the backend functionality for this modal, which stores the menu header
 * image URL in the database, throws an error in case of inserting a duplicate
 * URL or an invalid URL. This case is handled by the backend, and the frontend
 * displays an error message to let the user know.
 *
 * @summary     Modal used to change the header image of the Menu page.
 * @author      Alejandro Rodriguez Pascual
 */

import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Modal, FormControl, OutlinedInput, Snackbar, IconButton } from "@material-ui/core";
import "../css/ChangeHeaderModal.css";
import ClearIcon from "@material-ui/icons/Clear";
import { getJWT, logout } from "../util/Auth";

const config = require("../config");

const BACKEND_URL = config.backend.uri;

/**
 * Renders a red asterisk that indicates a required field.
 *
 * @returns {HTMLParagraphElement} - Red asterisk to indicate a required field
 */
function requiredAsterisk() {
  return <p className="requiredAsterisk">*</p>;
}

/**
 * Renders the modal used to change the URL of the Menu page's header image.
 *
 * @param {boolean} changeHeaderModal - show/hide modal
 * @param {function} setChangeHeaderModal - set changeHeaderModal
 * @param {function} setLoaded - sets AdminMenuItems.js loaded state
 * @param {string} headerImageUrl - current header image URL
 * @returns {HTMLElement} - A modal with implemented functionality
 */
export default function ChangeHeaderModal(props) {
  // inherit display functions as props
  const showModal = props.changeHeaderModal;
  const setShowModal = props.setChangeHeaderModal;
  const { setLoaded } = props;

  // error handling
  const [menuError, setMenuError] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState({
    display: false,
    message: "",
  });
  // const [failedAdminAuth, setFailedAdminAuth] = useState(false);

  // form's states
  const [headerImageURL, setHeaderImageURL] = useState(props.headerImageURL);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validate input
    if (headerImageURL === "") {
      setMenuError(true);
      setErrorSnackbar({ display: true, message: "URL cannot be empty" });
      return;
    }
    // create the object to oush to the database
    const imageURLObject = {
      imageUrl: headerImageURL,
      token: getJWT(),
    };
    // push to database
    await fetch(`${BACKEND_URL}menuImages/changeMenuImage`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(imageURLObject),
    }).then((res) => {
      // success
      if (res.ok) {
        alert("The header image was changed!");
        // refetch
        setLoaded(false);
        setShowModal(false);
      }
      // invalid admin token
      else if (res.status === 401) {
        logout();
        // refresh will cause a redirect to login page
        window.location.reload();
      }
      // system error on backend
      else if (res.status === 500) {
        setMenuError(true);
        setErrorSnackbar({
          display: true,
          message: "A system error has occurred - try again later",
        });
      }
      // failure
      else {
        setMenuError(true);
        setErrorSnackbar({ display: true, message: "URL is either already in use or invalid" });
      }
    });
  };
  return (
    <>
      {/* Failure Snackbar */}
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={errorSnackbar.display}
        autoHideDuration={5000}
        onClose={() => setErrorSnackbar({ ...errorSnackbar, display: false })}
        message={<span id="message-id">{errorSnackbar.message}</span>}
      />
      {/* Change header image Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        className="modalContainer"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div className="modalBackground">
          <div className="modalHeader">
            {/* Modal close button */}
            <IconButton className="closeModalButton" onClick={() => setShowModal(false)}>
              <ClearIcon />
            </IconButton>
          </div>
          <form autoComplete="off" onSubmit={(e) => handleSubmit(e)}>
            <div className="modalBody">
              {/* Header image URL */}
              <p className="formLabelText">Image Link {requiredAsterisk()}</p>
              <FormControl
                fullWidth
                error={menuError && headerImageURL === ""}
                className="formItem"
                margin="dense"
              >
                <OutlinedInput
                  name="imageUrl"
                  id="imageUrl"
                  className="formTextInput"
                  value={headerImageURL}
                  onChange={(e) => setHeaderImageURL(e.target.value)}
                  size="small"
                />
              </FormControl>
            </div>
            <div className="modalFooter">
              {/* Change header button */}
              <Button className="changeHeaderButton" type="submit">
                Change Header
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
