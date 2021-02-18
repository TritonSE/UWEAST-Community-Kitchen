/**
 * This file contains the code for the "Email" tab
 * under the "Admin" tab on the webpage. This page enables
 * the admin user to update their primary email or add 
 * secondary emails.
 * 
 * @summary - the email updating page
 */

import React from 'react';
import ChangeEmailScreen from '../components/ChangeEmailScreen';
import ChangeSecondaryEmailScreen from '../components/ChangeSecondaryEmailScreen';

const config = require('../config');
const BACKEND_URL = config.backend.uri;

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

        console.log(this.state);
        return (
            <div>
                {/* Primary email section */}
                <ChangeEmailScreen />

                {/* Secondary email section */}
                <ChangeSecondaryEmailScreen emails={this.state.secondaryEmailsList} 
                    updateSecondaryEmails={this.updateSecondaryEmails}
                />
            </div>
        )
    }
}