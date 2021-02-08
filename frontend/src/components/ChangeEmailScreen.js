import React, {useState, useEffect} from 'react';
import {Modal, Button} from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';

import '../css/ChangeEmailScreen.css';

const config = require('../config');
const BACKEND_URL = config.backend.uri;


// calls email change route
async function handleFormSubmit(email, setInputError){
    await fetch(`${BACKEND_URL}email/change`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                "email": email
            })
        }).then(res => {
            if(res.ok){
                alert("Email update successful!");
                setInputError(false);
            }
            else {
                setInputError(true);
            }
        })
}

export default function AdminMenuItems (props) {
    const [inputEmail, setInputEmail] = useState("");
    const [inputError, setInputError] = useState(false);
    // catch enter rerendeing entire admin page
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            
        }
    }
    return (
        <div> 
            <br />
            <h1 className="emailHeading">Change Email</h1>
            <p className="emailDescription">Order confirmations will be sent to this email</p>
            <form noValidate autoComplete="off">
                <br />
                <TextField id="email-input" 
                    error={inputError} 
                    value={inputEmail} 
                    type="email" 
                    className="emailUpdateInput" 
                    onChange={(e) => setInputEmail(e.target.value)} 
                    onKeyDown={(e) => handleKeyDown(e)}
                    label="email" 
                    variant="outlined"
                />
                <br />
                <br />
                <Button id="submit" 
                    className="emailUpdateButton" 
                    onClick={() => handleFormSubmit(inputEmail, setInputError)}
                >
                    Update
                </Button>
            </form>
        </div>
    )
}
