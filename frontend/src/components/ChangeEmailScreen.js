/**
 * This renders the "change primary email" portion of
 * The "emails" tab under the "Admin" page.
 * 
 */

import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';

import '../css/ChangeEmailScreen.css';

const config = require('../config');
const BACKEND_URL = config.backend.uri;


// calls email change route
async function handleFormSubmit(email, setInputError, setOpen){
    // validate to make sure email is an email. We do this here because
    // we don't want to overload the server with invalid emails
    if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
        setInputError(true);
        return;
    }

    // change the primary email backend call
    await fetch(`${BACKEND_URL}email/changePrimary`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                email: email
            })
        }).then(res => {
            if(res.ok){
                setInputError(false);
                setOpen(true);
            }
            else {
                console.log(res);
                setInputError(true);
            }
        })
}

export default function AdminMenuItems (props) {
    const [inputEmail, setInputEmail] = useState("");
    const [inputError, setInputError] = useState(false);
    const [open, setOpen] = useState(false);

    // catch enter rerendeing entire admin page
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleFormSubmit(inputEmail, setInputError, setOpen)
        }
    }

    return (
        <div> 
            <br />
            <h1 className="emailHeading">Change Primary Email</h1>
            <p className="emailDescription">Order confirmations and customer inquiries will be sent to this email.</p>
            <br />
                <TextField id="email-input" 
                    size="small"
                    error={inputError} 
                    value={inputEmail} 
                    type="email" 
                    className="emailUpdateInput" 
                    onChange={(e) => setInputEmail(e.target.value)} 
                    onKeyDown={(e) => handleKeyDown(e)}
                    label="Primary Email" 
                    variant="outlined"
                />
            <br />
            <br />

            <Button id="submit" 
                className="emailUpdateButton" 
                onClick={() => handleFormSubmit(inputEmail, setInputError, setOpen)}
            >
                Update
            </Button>

            <Snackbar open={open} autoHideDuration={4000} onClose={(e) => setOpen(false)}
                message="Email updated successfully!">
            </Snackbar>
        </div>
    )
}
