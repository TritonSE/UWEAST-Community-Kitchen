import React from 'react';
import NavBar from '../components/NavBar';
import OrdersTable from '../components/OrdersTable';
import '../css/Orders.css';

const config = require('../config');

const BACKEND_URL = config.backend.uri;

export default class Orders extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            getOrders: []
        }
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
            const length = getOrdersList.length
            console.log(getOrdersList);
            let createArr = [];

            for(let i = 0; i < length; i++) {
                let arr = [];
                const getDate = getOrdersList[i].Pickup.split("-");
                const date = getDate[1] + "/" + getDate[2].substring(0, 2) + "/" + getDate[0];

                arr.push(date);
                arr.push(getOrdersList[i].Customer.Name);
                arr.push(getOrdersList[i].Customer.Email);
                arr.push(getOrdersList[i].Customer.Phone);
                arr.push(getOrdersList[i].PayPal.Amount);
                arr.push(getOrdersList[i].Order)

                createArr.push(arr);
            }

            this.setState({ getOrders: createArr }, () => console.log(this.state.getOrders))
        })
        .catch(err => console.log(err));
    }
    
    render() {
        return (
            <div>
                <NavBar />
                <div className="orders-table">
                    <div className="justify-table-center">
                        <OrdersTable orders={this.state.getOrders} />
                    </div>
                </div>
            </div>
        )
    }
}