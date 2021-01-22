import React from 'react';
import NavBar from '../components/NavBar';
import OrdersTable from '../components/OrdersTable';

const config = require('../config');

const BACKEND_URL = config.backend.uri;

export default class Orders extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        fetch(`${BACKEND_URL}order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => console.log(data))
    }
    
    render() {
        return (
            <div>
                <NavBar />
                <OrdersTable />
            </div>
        )
    }
}