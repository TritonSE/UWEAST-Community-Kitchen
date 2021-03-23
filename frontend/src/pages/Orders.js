/**
 * This file renders the Orders Table on the Admin page.
 * It imports the table from OrdersTable.js.
 * 
 * @summary Handles rendering of Orders table (main component).
 */

import React from 'react';
import OrdersTable from '../components/OrdersTable';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getJWT, logout } from '../util/Auth';
import {  Snackbar, SnackbarContent  } from '@material-ui/core';
import '../css/Orders.css';

const config = require('../config');

const BACKEND_URL = config.backend.uri;

export default class Orders extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            getOrders: [],
            Loading: true,
            Error: false,
            ErrorMessage: ""
        }

        this.formatTime = this.formatTime.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.formatArray = this.formatArray.bind(this);
        this.formatString = this.formatString.bind(this);
        this.getOrders = this.getOrders.bind(this);
        this.formatError = this.formatError.bind(this);
    }

    formatError(isError, message) {
        this.setState({
            Error: isError,
            ErrorMessage: message
        })
    }

    /**
     * Formats the data from the fetch() call into the array.
     * 
     * @param {Object} list - Information about order
     * @param {String} date - Pick up date
     * @param {String} formatCurrTime - Pick up time
     * @param {String} dateSubmission - Submission date
     * @param {String} formatCurrTimeSubmission - Submission time
     * @returns {array} - Formated array
     */
    formatArray(list, date, formatCurrTime, dateSubmission, formatCurrTimeSubmission) {
        let val = formatCurrTime;
        let val2 = formatCurrTimeSubmission;

        const dateOne = date + `\n${val}`;
        const dateTwo = dateSubmission + `\n${val2}`;

        let email = this.formatString(list.Customer.Email, 24);
        let name = this.formatString(list.Customer.Name, 14);
        let paypalStatus = "Pending";

        if(list.PayPal.status === 1) {
            paypalStatus = "Accepted";
        } else if(list.PayPal.status === 2) {
            paypalStatus = "Rejected";
        }

        return [list.PayPal.transactionID, dateOne, name, email, list.Customer.Phone, 
            list.PayPal.Amount, list.Order, dateTwo, list.isCompleted ? "Completed Orders" : "Pending Orders", paypalStatus, list._id];
    }

    /**
     * This method adds in '\n' so the line in the table will go to the next
     * line. This allows for consist formating so the table doesn't have weird
     * issues.  
     * 
     * @param {String} str - The string to format
     * @param {String} length - Number of characters per line 
     * @returns - restructured string
     */
    formatString(str, length) {
        let tempEmail = str;
        if(parseInt(str.length / length) > 0) {
            let i = length;
            while(i < str.length) {
                tempEmail = tempEmail.slice(0, i) + '\n' + tempEmail.slice(i, str.length);  
                i += length;  
            }

        } else {
            const difference = length - str.length;
            let i = 0;
            while (i < difference) {
                tempEmail += " ";
                i++;
            }
        }

        return tempEmail;
    }

    /**
     * Formats the time in the HH:MM (P.M. OR A.M.).
     * 
     * @param {String} time 
     * @returns {String} - The formated time
     */
    formatTime(time) {
        // convert to array
        time = time.split(':');
        
        let hours = Number(time[0]);
        let minutes = Number(time[1]);
        let timeValue;

        if (hours > 0 && hours <= 12) timeValue = "" + hours; 
        else if (hours > 12) timeValue = "" + (hours - 12);
        else if (hours === 0) timeValue = "12";
        
        // get minutes
        timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  
        // get AM/PM
        timeValue += (hours >= 12) ? " P.M." : " A.M."; 

        return timeValue;
    }

    /**
     * Formats the date to be in the MM/DD/YYYY format.
     * 
     * @param {String} getDate 
     * @returns {String} - The formated date
     */
    formatDate(getDate) {
        const monthSubmission = getDate.getMonth()+1 >= 10 ? getDate.getMonth()+1 : ("0" + (getDate.getMonth() + 1)).slice(-2);
        const dateSubmission = monthSubmission + "/" + getDate.getDate() + "/" + getDate.getFullYear();   
        return dateSubmission 
    }

    getOrders() {
        fetch(`${BACKEND_URL}order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"token": getJWT()})
        }).then(res => {
             // invalid admin token
            if(res.status === 401){
                logout();
                // refresh will cause a redirect to login page
                window.location.reload();
                return;
            }
            return res.json();
        })
        .then(data => {
            const getOrdersList = data.orders;
            const length = getOrdersList.length
            let createArr = [];

            for(let i = 0; i < length; i++) {
                // get the date from the database
                let getDate = new Date(getOrdersList[i].Pickup);
                const formatCurrtime = this.formatTime(getDate.getHours() + ":" + getDate.getMinutes() + ":" + getDate.getSeconds());
                const date = this.formatDate(getDate);

                // format for the submission date
                let getDateSubmission = new Date(getOrdersList[i].createdAt);
                const formatCurrtimeSubmission = this.formatTime(getDateSubmission.getHours() + ":" + getDateSubmission.getMinutes() + ":" + getDateSubmission.getSeconds());
                const dateSubmission = this.formatDate(getDateSubmission);

                const formatedArray = this.formatArray(getOrdersList[i], date, formatCurrtime, dateSubmission, formatCurrtimeSubmission)
                createArr.push(formatedArray);
            }
            this.setState({ getOrders: createArr, Loading: false}) 
        })
        .catch(err => console.log(err));
    }

    /**
     * Get all the orders from the database.
     */
    componentDidMount() {
        this.getOrders();
    }
    
    render() {
        return (
            <div className="orders-page-container">
                {/* Render a progress spinner to show it is loading */}
                {this.state.Loading ? 
                <div className="spinner-orders-page">
                    <CircularProgress />
                </div> : 
                <div className="orders-table">
                    <div className="justify-table-center">
                        <OrdersTable orders={this.state.getOrders} render={this.getOrders} error={this.formatError}/>
                    </div>
                </div>
                }
                <Snackbar open={this.state.Error} autoHideDuration={3000} onClose={() => this.formatError(false, "")}>
                    <SnackbarContent message={this.state.ErrorMessage} style={{ color: 'white'}} />
                </Snackbar>
            </div>
        )
    }
}