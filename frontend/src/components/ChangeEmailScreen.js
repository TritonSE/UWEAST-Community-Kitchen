import React, {useState} from 'react';
import { Button} from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';

import '../css/ChangeEmailScreen.css';

const config = require('../config');
const BACKEND_URL = config.backend.uri;


// calls email change route
async function handleFormSubmit(email, setInputError){
    // validate to make sure email is an email. We do this here because
    // we don't want to overload the server with invalid emails
    if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
        setInputError(true);
        return;
    }
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

            handleFormSubmit(inputEmail, setInputError)
        }
    }
    const validate = values => {
        const errors = {}
        const requiredFields = [ 'firstName', 'lastName', 'email', 'favoriteColor', 'notes' ]
        requiredFields.forEach(field => {
            if (!values[ field ]) {
            errors[ field ] = 'Required'
            }
        })
        if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid email address'
        }
        return errors
    }
    return (
        <div> 
            <br />
            <h1 className="emailHeading">Change Email</h1>
            <p className="emailDescription">Order confirmations will be sent to this email</p>
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
        </div>
    )
}
