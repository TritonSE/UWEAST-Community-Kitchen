import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons'

import '../css/ChangeEmailScreen.css';

const config = require('../config');
const BACKEND_URL = config.backend.uri;

/**
 * 
 * @param {string} email
 * @param {array} secondaryEmails 
 * @param {function} setSecondaryEmails 
 * @param {function} updateSecondaryEmails - parent function to update parent state 
 */
const renderNode = (email, secondaryEmails, setSecondaryEmails, updateSecondaryEmails) => {
    // delete the email from the database
    const deleteItem = () => {
        fetch(`${BACKEND_URL}email/removeSecondary`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                // update the array in the current class
                // and in the parent class
                const arr = secondaryEmails.filter(a => a !== email);
                setSecondaryEmails(arr);
                updateSecondaryEmails(arr);
            }
        })    
    }
    
    return (
        <div>
            <p className="secondary-email-name">{email}</p>
            <FontAwesomeIcon icon={faTrash} className="trash-icon" 
                onClick={(e) => deleteItem()}
            />
        </div>
    )
}

// styling used for the plus icon
const plusIcon = {
    color: 'white',
    marginRight: 'calc(0.5vw)'
}

export default function ChangeSecondaryEmailScreen (props) {
    const updateSecondaryEmails = props.updateSecondaryEmails;
    const [secondaryEmails, setSecondaryEmails] = useState([]);
    const [addSecondaryEmail, setAddSecondaryEmail] = useState("");
    const [inputError, setInputError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // allows user to press 'enter' to submit
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            addEmail(addSecondaryEmail);    
        }
    }

    // loads all emails from the parent class
    useEffect(() => {
        setSecondaryEmails(props.emails);
    }, [props])

    /**
     * Adds the email to the database
     * 
     * @param {string} addSecondaryEmail - email to add
     */
    const addEmail = (addSecondaryEmail) => {
        if (addSecondaryEmail && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(addSecondaryEmail) || addSecondaryEmail.length === 0) {
            setErrorMessage("Enter a valid Email Address");
            setInputError(true);
            return;
        }

        fetch(`${BACKEND_URL}email/addSecondary`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: addSecondaryEmail
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                // update the parent's array and the child's array
                const getNewEmail = addSecondaryEmail;
                const arr = secondaryEmails.concat(getNewEmail)
                setSecondaryEmails(arr);
                updateSecondaryEmails(arr);
                // clear the textfield
                setAddSecondaryEmail("");
                // clear any error handling
                setInputError(false);
                setErrorMessage("");
            } else {
                // error handling
                if(data.message === "User input is malformed") setErrorMessage("Email already added to List")
                setInputError(true);
            }
        })
    }

    return (
        <div> 
            <br />
            <br />
            <br />
            <h1 className="emailHeading">Change Secondary Email</h1>
            <p className="emailDescription">Order confirmations will be sent to this email.</p>
            
            <div className="secondary-emails">
                {secondaryEmails.map((secondary, ind) => (
                    renderNode(secondary, secondaryEmails, setSecondaryEmails, updateSecondaryEmails)
                ))}
            </div>

            <div className="add-secondary-email">
                <TextField id="email-input" 
                    size="small"
                    error={inputError} 
                    value={addSecondaryEmail} 
                    type="email" 
                    className="emailUpdateInput" 
                    onChange={(e) => setAddSecondaryEmail(e.target.value)} 
                    onKeyDown={(e) => handleKeyDown(e)}
                    label="Add Secondary Email" 
                    variant="outlined"
                    style={{width: 'calc(25vw)'}}
                    helperText={errorMessage}
                />

                <Button id="submit" className="emailAddButton" 
                    onClick={(e) => addEmail(addSecondaryEmail)}
                >
                    <FontAwesomeIcon icon={faPlusCircle} style={plusIcon} />
                        Add
                </Button>
            </div>
        </div>
    )
}
