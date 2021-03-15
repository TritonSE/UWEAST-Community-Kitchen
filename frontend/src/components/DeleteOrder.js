/**
 * This renders the modal that asks for confirmation to 
 * delete an order. It gives two checkboxes inside so 
 * the admin user can send confirmation emails to all
 * admin users and/or the customer who places the order.
 * 
 * It also only renders when the trash can is clicked
 * on the toolbar. 
 * 
 * @summary The delete order modal. 
 */

import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { getJWT, logout } from '../util/Auth';
import '../css/Orders.css';

const config = require('../config');

const BACKEND_URL = config.backend.uri;
const PAYPAL_URL = "https://www.paypal.com/activity/payment/"

export default function DeleteOrder(props) {
    const [showModal, setShow] = useState(false);
    const [admin, setAdmin] = useState(true);
    const [customer, setCustomer] = useState(false);

    useEffect(() => {
        setShow(props.show);
    }, [props])

    const hideModal = () => {
        setShow(false);
        props.updateParentShow(false);
    }

    const orderDeletion = () => {
        fetch(`${BACKEND_URL}order/cancelOrder`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "token": getJWT(),
                _id: props._id,
                adminReceipt: admin,
                customerReceipt: customer
            })
        }).then(res => {
             // invalid admin token
             if (res.status === 401){
                logout();
                // refresh will cause a redirect to login page
                window.location.reload();
                return;
            }

             // order could not be deleted 
            else if(res.status >= 400){
                props.error(true, "Error! Could not Delete Order");
                hideModal();
                props.setSelectedRows([]);  
                props.render();  
                return;
            }

            return res.json();
        })
        .then(data => {
            hideModal();
            props.error(true, data.msg);
            props.setSelectedRows([]);  
            props.render();     
             
        })
        .catch(err => console.log(err));
    }
    
    return (
        <div>
            <Modal 
                show={showModal} 
                onHide={(e) => hideModal()} 
                backdrop='static'
                style={{"marginTop": "30vh"}}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <p>Are you sure you want to permanently remove {"this order"} from your order history?</p>

                        <form className="delete-order-form">
                            <div>
                                <input type="checkbox" id="users-email" checked={admin} onChange={(e) => setAdmin(!admin)}/>
                                <label for="users-email">Send cancellation email to admins.</label>
                            </div>

                            <div>
                                <input type="checkbox" id="customer-email" checked={customer} onChange={(e) => setCustomer(!customer)}/>
                                <label for="customer-email">Send cancellation email to customer. </label>
                            </div>
                        </form>

                        <span>
                            <p className="note-paypal">Note: Deleting this order will not automatically refund it to the customer. 
                            If you need to refund this order, you can do a manual refund by clicking 
                            {' '}<a href={`${PAYPAL_URL}${props.paypalId}`} target="_blank">here</a>.</p>
                        </span>
                    </div>
                </Modal.Body>
                
                <Modal.Footer>
                    <Button variant="primary" className="menuAddButton" onClick={() => orderDeletion()}>
                        Remove Item
                    </Button>
                    <Button variant="secondary" onClick={() => hideModal()} >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}