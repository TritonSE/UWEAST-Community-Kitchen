import React from 'react';
import NavBar from '../components/NavBar';
import OrdersTable from '../components/OrdersTable';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
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
    }

    formatTime(time) {
        time = time.split(':'); // convert to array
        
        let hours = Number(time[0]);
        let minutes = Number(time[1]);
        let timeValue;

        if (hours > 0 && hours <= 12) timeValue = "" + hours; 
        else if (hours > 12) timeValue = "" + (hours - 12);
        else if (hours == 0) timeValue = "12";
        
        timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
        timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM

        return timeValue;
    }

    formatDate(getDate) {
        const monthSubmission = getDate.getMonth()+1 >= 10 ? getDate.getMonth()+1 : ("0" + (getDate.getMonth() + 1)).slice(-2);
        const dateSubmission = monthSubmission + "/" + getDate.getDate() + "/" + getDate.getFullYear();   
        return dateSubmission 
    }

    componentDidMount() {
        fetch(`${BACKEND_URL}order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => {
            const getOrdersList = data.orders;
            console.log(getOrdersList);
            const length = getOrdersList.length
            let createArr = [];

            for(let i = 0; i < length; i++) {
                let arr = [];
                //Get the date from the database
                let getDate = new Date(getOrdersList[i].Pickup);
                const formatCurrtime = this.formatTime(getDate.getHours() + ":" + getDate.getMinutes() + ":" + getDate.getSeconds());
                const date = this.formatDate(getDate);

                //Format for the submission date
                let getDateSubmission = new Date(getOrdersList[i].createdAt);
                const formatCurrtimeSubmission = this.formatTime(getDateSubmission.getHours() + ":" + getDateSubmission.getMinutes() + ":" + getDateSubmission.getSeconds());
                const dateSubmission = this.formatDate(getDateSubmission);

                arr.push(date + `\n${formatCurrtime}`);
                arr.push(getOrdersList[i].Customer.Name);
                arr.push(getOrdersList[i].Customer.Email);
                arr.push(getOrdersList[i].Customer.Phone);
                arr.push(getOrdersList[i].PayPal.Amount);
                arr.push(getOrdersList[i].Order);
                arr.push(dateSubmission + `\n${formatCurrtimeSubmission}`);
                arr.push(getOrdersList[i].isCompleted);
                arr.push(getOrdersList[i]._id);

                createArr.push(arr);
            }
            this.setState({ getOrders: createArr, Loading: false})
        })
        .catch(err => console.log(err));
    }
    
    render() {
        return (
            <div className="orders-page-container">
                <NavBar />
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