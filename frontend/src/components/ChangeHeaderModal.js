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
 */

import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Modal, FormControl, OutlinedInput, Snackbar, IconButton } from '@material-ui/core';
import '../css/ChangeHeaderModal.css';
import ClearIcon from '@material-ui/icons/Clear';
const config = require('../config');
const BACKEND_URL = config.backend.uri;

/**
 * Renders a red asterisk that indicates a required field.
 * 
 * @returns {HTMLParagraphElement} - Red asterisk to indicate a required field
 */
function requiredAsterisk(){
    return (
        <p className="requiredAsterisk">*</p>
    );
}

/**
 * Renders the modal used to change the URL of the Menu page's header image.
 * 
 * @param   {any} props - props for the modal. It must contain:
 *                      + changeHeaderModal {boolean}: show/hide modal
 *                      + setChangeHeaderModel {function}: set changeHeaderModal
 *                      + setLoaded {function}: sets AdminMenuItems.js loaded state
 *                      + headerImageUrl {string}: current header image URL
 * @returns {HTMLElement} - A modal with implemented functionality
 */
export default function ChangeHeaderModal (props){
    // inherits display functions as props
    const showModal = props.changeHeaderModal;
    const setShowModal = props.setChangeHeaderModal;
    const setLoaded = props.setLoaded;

    // error handling
    const [menuError, setMenuError] = useState(false);
    const [errorSnackbar, setErrorSnackbar] = useState(false);

    // form's states
    const [headerImageURL, setHeaderImageURL] = useState(props.headerImageURL);

    const handleSubmit = async () => {
        // validates input
        if (headerImageURL === "")
        {
            console.log("failed header image input");
            setMenuError(true);
            setErrorSnackbar(true);
            return;
        }
        // creates the object to oush to the database
        const imageURLObject = {
            "imageUrl": headerImageURL,
        }
        // pushes to database
        await fetch(`${BACKEND_URL}menuImages/changeMenuImage`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(imageURLObject)
        }).then(res => {
            // success
            if(res.ok){
                alert("The header image was changed!");
                // refetches
                setLoaded(false);
                setShowModal(false);
            }
            // failure
            else{
                alert("There was an error. Check your input and try again");
            }
        })

    }
    return(
        <>
            {/* Failure Snackbar */}
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={errorSnackbar}
                autoHideDuration={5000}
                onClose={() => setErrorSnackbar(false)}
                message={<span id="message-id">Please fill in the required fields</span>}
            />
            {/* Change header image Modal */}
            <Modal open={showModal} onClose={() => setShowModal(false)} 
                className="modalContainer"
            >
                <div className="modalBackground">
                    <div className="modalHeader">
                        {/* Modal close button */}
                        <IconButton className="closeModalButton" 
                            onClick={() => setShowModal(false)}
                        >
                            <ClearIcon/>
                        </IconButton>
                    </div>
                    <form autocomplete="off">
                        <div className="modalBody">
                            {/* Header image URL */}
                            <p className="formLabelText">Image Link {requiredAsterisk()}</p>
                            <FormControl fullWidth error={menuError && headerImageURL === ""} className="formItem" margin='dense'>
                                <OutlinedInput name="imageURL" id="imageURL" className="formTextInput"
                                    required 
                                    value={headerImageURL}
                                    onChange={(e) => setHeaderImageURL(e.target.value)}
                                    size="small"
                                />
                            </FormControl>
                        </div>
                        <div className="modalFooter">
                            {/* Change header button */}
                            <Button className="changeHeaderButton" onClick={() => handleSubmit()}>
                                Change Header
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}