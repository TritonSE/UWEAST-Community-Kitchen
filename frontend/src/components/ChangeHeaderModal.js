import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Modal, FormControl, OutlinedInput, Snackbar, IconButton } from '@material-ui/core';
import '../css/ChangeHeaderModal.css';
import ClearIcon from '@material-ui/icons/Clear';
const config = require('../config');
const BACKEND_URL = config.backend.uri;

/*
    This file contains the modal for changing the URL for the header image of the menu page.
    The URL field is required.

    An error is thrown if and only if the "Image Link" field is empty.
*/

// Renders a red asterisk that indicates a required field
function requiredAsterisk(){
    return (
        <p className="requiredAsterisk">*</p>
    );
}

export default function ChangeHeaderModal (props){
    // Inherits display functions as props
    const showModal = props.changeHeaderModal;
    const setShowModal = props.setChangeHeaderModal;
    const setLoaded = props.setLoaded;

    // Error handling
    const [menuError, setMenuError] = useState(false);
    const [errorSnackbar, setErrorSnackbar] = useState(false);

    // Form's states
    const [headerImageURL, setHeaderImageURL] = useState("")

    const handleSubmit = async () => {
        // Validates input
        if (headerImageURL === "")
        {
            console.log("failed header image input");
            setMenuError(true);
            setErrorSnackbar(true);
            return;
        }
        // (Placeholder) gives alert and closes modal
        alert("The header image was changed!");
        setLoaded(false);
        setShowModal(false);
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
                message={<span id="message-id">Please complete all required fields</span>}
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