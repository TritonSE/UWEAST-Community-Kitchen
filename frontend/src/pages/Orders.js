import React from 'react';
import NavBar from '../components/NavBar';
import OrdersTable from '../components/OrdersTable';

export default class Orders extends React.Component {
    constructor(props) {
        super(props);
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