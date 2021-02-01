import React, { useState } from 'react';
import '../css/Orders.css';

export default function OrdersStatus(props) {
    const [status, setStatus] = useState(props.value);
    const [rowId, setRowId] = useState(props.rowInfo.rowData[7]);

    const updateStatus = (newStatus) => {
        console.log(newStatus);
        setStatus(newStatus === "false" ? false : true);
    }

    console.log(status);
    
    return (
        <div className="orders-status">
            <select className={status ? "dropdown-menu-completed" : "dropdown-menu-pending"} value={status} onChange={(e) => updateStatus(e.target.value)}
                onClick={(e) => {
                    //This prevents the current row from expanding
                    e.stopPropagation();
                    e.preventDefault();
                }}>
                <option value={false}>Pending</option>
                <option value={true}>Completed</option>
            </select> 
        </div>  
    )
}