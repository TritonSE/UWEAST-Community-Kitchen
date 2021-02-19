/**
 * This file contains the code for the "Email" tab
 * under the "Admin" tab on the webpage. This page enables
 * the admin user to update their primary email or add/remove
 * secondary emails.
 * 
 * @summary primary and secondary email updating for the admin user
 */

import React from 'react';
import ChangeEmailScreen from '../components/ChangeEmailScreen';
import ChangeSecondaryEmailScreen from '../components/ChangeSecondaryEmailScreen';
import FormHelperText from '@material-ui/core/FormHelperText';
import '../css/ChangeEmailScreen.css';

const config = require('../config');
const BACKEND_URL = config.backend.uri;

// provides the red asterix to indicate important note
function requiredAsterix() {
    return (
        <p className="requiredAsterix">*</p>
    );
}

export default class Emails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            secondaryEmailsList: [],
            primaryEmail: ""
        }

        this.getSecondaryEmails = this.getSecondaryEmails.bind(this);
        this.getPrimaryEmail = this.getPrimaryEmail.bind(this);
        this.updateSecondaryEmails = this.updateSecondaryEmails.bind(this);
        this.updatePrimaryEmail = this.updatePrimaryEmail.bind(this);
    }

    /**
     * GET all secondary emails
     */
    getSecondaryEmails() {
        fetch(`${BACKEND_URL}email/secondary`)
        .then(res => res.json())
        .then(data => {
            // convert to array of just emails
            const emailArr = [];
            for(let item in data.emails) {
                emailArr.push(data.emails[item].email)
            }
            
            this.setState({ secondaryEmailsList: emailArr });
        })
    }

    /**
     * Used to update the state in this class from the child class
     * 
     * @param {array} emails - list of secondary emails 
     */
    updateSecondaryEmails(emails) {
        this.setState({ secondaryEmailsList: emails });
    }

    /**
     * Used to update the state in this class from the child class
     * 
     * @param {array} email - primary email
     */
    updatePrimaryEmail(emails) {
        this.setState({ primaryEmail: emails });
    }

    /**
     * GET the primary email
     */
    getPrimaryEmail() {
        fetch(`${BACKEND_URL}email/primary`)
        .then(res => res.json())
        .then(data => {
            this.setState({ primaryEmail: data.email.email });
        })    
    }

    /**
     * Get all relevant information when the page loads
     */
    componentDidMount() {
        this.getPrimaryEmail();
        this.getSecondaryEmails();
    }

    render() {
        return (
            <div>
                <div className="disclaimer">
                    <FormHelperText id="component-helper-text">{requiredAsterix()} 
                        {' '} Note: An email can be either a Primary Email, 
                        or a Secondary Email - not both.
                    </FormHelperText>
                </div>
                {/* Primary email section */}
                <ChangeEmailScreen 
                    emails={this.state.secondaryEmailsList} 
                />

                {/* Secondary email section */}
                <ChangeSecondaryEmailScreen emails={this.state.secondaryEmailsList} 
                    updateSecondaryEmails={this.updateSecondaryEmails}
                    primaryEmail={this.state.primaryEmail}
                />
            </div>
        )
    }
}