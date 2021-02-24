/**
 * This file renders the information related to the secondary emails.
 * It displays all the current secondary emails that that admin 
 * user has authorized.
 * It makes two calls to the backend:
 * 
 *  1) POST call to add secondary email
 *  2) DELETE call to remove a secondary email
 * 
 * @summary     Handles functionality of secondary emails on Admin page.
 */

import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '@material-ui/core/styles';

import '../css/ChangeEmailScreen.css';

const config = require('../config');
const BACKEND_URL = config.backend.uri;

// styling for the MUI form
const useStyles = makeStyles((theme) => ({
    span: {
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black"
      },
      "& .MuiInputLabel-outlined.Mui-focused": {
        color: "black"
      }
    }
}));

/**
 * Renders the node containing the email addresses.
 * 
 * @param {string} email - Secondary email
 * @param {array} secondaryEmails - List of all current secondary emails
 * @param {function} setSecondaryEmails - Function to update secondary emails list
 * @param {function} updateSecondaryEmails - Parent function to update parent state 
 * @returns {component} - Renders the node with email
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
    const classes = useStyles();
    const updateSecondaryEmails = props.updateSecondaryEmails;
    const [secondaryEmails, setSecondaryEmails] = useState([]);
    const [primaryEmail, setPrimaryEmail] = useState("");
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
        setPrimaryEmail(props.primaryEmail);
    }, [props])

    /**
     * Adds the email to the database.
     * 
     * @param {string} addSecondaryEmail - Email to add
     */
    const addEmail = (addSecondaryEmail) => {
        // make sure email is not a primary email 
        if(addSecondaryEmail === primaryEmail) {
            setErrorMessage("This is currently your primary email."); 
            setInputError(true);
            return;
        }

        // make sure the email follows proper format
        if (addSecondaryEmail && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(addSecondaryEmail) || addSecondaryEmail.length === 0) {
            setErrorMessage("Enter a valid email address.");
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
                setErrorMessage("This email is already listed as a secondary email."); 
                setInputError(true);
            }
        })
    }

    return (
        <div className="secondary-emails-container"> 
            <h1 className="emailHeading">Change Secondary Email</h1>
            <p className="emailDescription">Order confirmations will be sent to this email.</p>
            
            <div className="secondary-emails">
                {secondaryEmails.map((secondary, ind) => (
                    renderNode(secondary, secondaryEmails, setSecondaryEmails, updateSecondaryEmails)
                ))}
            </div>
            
            {/* The textfield */}
            <div className="add-secondary-email">
                <span className={classes.span}>
                    <TextField id="email-input" 
                        size="small"
                        error={inputError} 
                        value={addSecondaryEmail} 
                        type="email" 
                        onChange={(e) => setAddSecondaryEmail(e.target.value)} 
                        onKeyDown={(e) => handleKeyDown(e)}
                        label="Add Secondary Email" 
                        variant="outlined"
                        helperText={errorMessage}
                        id="secondaryEmail"
                    />
                </span>

                <Button id="submit" className="emailAddButton" 
                    onClick={(e) => addEmail(addSecondaryEmail)}
                >   
                    {/* The "add" icon */}
                    <FontAwesomeIcon icon={faPlusCircle} style={plusIcon} />
                        Add
                </Button>
            </div>
        </div>
    )
}
