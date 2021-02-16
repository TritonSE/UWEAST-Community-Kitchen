/**
 * This file renders the Orders Table on the Admin page.
 * It imports the table from OrdersTable.js. This file
 * 
 * Contains the database calls to fetch all the previous
 * Orders.
 * 
 */

import React from 'react';
import OrdersTable from '../components/OrdersTable';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../css/Orders.css';

const config = require('../config');

const BACKEND_URL = config.backend.uri;

export default class Orders extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            getOrders: [],
            Loading: true,
        }

        this.formatTime = this.formatTime.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.formatArray = this.formatArray.bind(this);
    }

    /**
     * Formats the data from the fetch() call into the array
     * @param {Object} list 
     * @param {String} date 
     * @param {String} formatCurrTime 
     * @param {String} dateSubmission 
     * @param {String} formatCurrTimeSubmission 
     */
    formatArray(list, date, formatCurrTime, dateSubmission, formatCurrTimeSubmission) {
        let val = formatCurrTime;
        let val2 = formatCurrTimeSubmission;

        const dateOne = date + `\n${val}`;
        const dateTwo = dateSubmission + `\n${val2}`;
        return [dateOne, list.Customer.Name, list.Customer.Email, list.Customer.Phone, 
            list.PayPal.Amount, list.Order, dateTwo, list.isCompleted ? "Completed Orders" : "Pending Orders", 
            list._id];
    }

    /**
     * Formats the time in the HH:MM (P.M. OR A.M.)
     * @param {String} time 
     */
    formatTime(time) {
        time = time.split(':'); // convert to array
        
        let hours = Number(time[0]);
        let minutes = Number(time[1]);
        let timeValue;

        if (hours > 0 && hours <= 12) timeValue = "" + hours; 
        else if (hours > 12) timeValue = "" + (hours - 12);
        else if (hours === 0) timeValue = "12";
        
        timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
        timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM

        return timeValue;
    }

    /**
     * Formats the date to be in the MM/DD/YYYY format
     * @param {String} getDate 
     */
    formatDate(getDate) {
        const monthSubmission = getDate.getMonth()+1 >= 10 ? getDate.getMonth()+1 : ("0" + (getDate.getMonth() + 1)).slice(-2);
        const dateSubmission = monthSubmission + "/" + getDate.getDate() + "/" + getDate.getFullYear();   
        return dateSubmission 
    }

    /**
     * Get all the orders from the database
     */
    componentDidMount() {
        fetch(`${BACKEND_URL}order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => {
            const getOrdersList = data.orders;
            const length = getOrdersList.length
            let createArr = [];

            for(let i = 0; i < length; i++) {
                //Get the date from the database
                let getDate = new Date(getOrdersList[i].Pickup);
                const formatCurrtime = this.formatTime(getDate.getHours() + ":" + getDate.getMinutes() + ":" + getDate.getSeconds());
                const date = this.formatDate(getDate);

                //Format for the submission date
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
                        <OrdersTable orders={this.state.getOrders} />
                    </div>
                </div>
                }
            </div>
        )
    }
}