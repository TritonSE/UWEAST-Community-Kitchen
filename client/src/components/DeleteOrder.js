/**
 * This renders the modal that asks for confirmation to
 * delete an order. It gives two checkboxes inside so
 * the admin user can send confirmation emails to all
 * admin users and/or the customer who places the order.
 *
 * It also only renders when the trash can is clicked
 * on the toolbar.
 *
 * @summary     The delete order modal.
 * @author      Amitesh Sharma
 */

import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { getJWT, logout } from "../util/Auth";
import "../css/Orders.css";

const config = require("../config");

const BACKEND_URL = config.backend.uri;
const PAYPAL_URL = "https://www.paypal.com/activity/payment/";

export default function DeleteOrder(props) {
  const [showModal, setShow] = useState(false);

  // if true, sends receipt to admin users
  const [admin, setAdmin] = useState(true);

  // if true, sends receipt to customer
  const [customer, setCustomer] = useState(false);

  // if true disables the both buttons
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // sets the modal when component initially renders
  useEffect(() => {
    setShow(props.show);
  }, [props]);

  // hides the delete order modal
  const hideModal = () => {
    setShow(false);
    props.updateParentShow(false);
  };

  // deletes the order from the database
  const orderDeletion = () => {
    // disable button to prevent spam clicks
    setButtonDisabled(true);

    // loading cursor to indicate to user they have to wait
    document.body.style.cursor = "wait";

    fetch(`${BACKEND_URL}order/cancelOrder`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: getJWT(), // string
        _id: props._id, // string
        adminReceipt: admin, // boolean
        customerReceipt: customer, // boolean
      }),
    })
      .then((res) => {
        // invalid admin token
        if (res.status === 401) {
          document.body.style.cursor = null;
          setButtonDisabled(false);
          logout();
          // refresh will cause a redirect to login page
          window.location.reload();
          return;
        }

        // order could not be deleted
        if (res.status >= 400) {
          document.body.style.cursor = null;
          setButtonDisabled(false);
          // renders the error message
          props.error(true, "Error! Could not Delete Order");
          hideModal();
          props.setSelectedRows([]);
          props.render();
          return;
        }

        return res.json();
      })
      .then((data) => {
        document.body.style.cursor = null;
        setButtonDisabled(false);
        // reset to initial states
        hideModal();
        props.error(true, data.msg);
        props.setSelectedRows([]);
        props.render();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {/* The delete order modal that renders when the trash can icon is clicked */}
      <Modal show={showModal} onHide={(e) => hideModal()} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Order</Modal.Title>
        </Modal.Header>
        {/* The modal body */}
        <Modal.Body>
          <div>
            <p>Are you sure you want to permanently remove this order from your order history?</p>

            {/* The checkboxes for the deletion modal */}
            <form className="delete-order-form">
              {/* Checkboxes for admin receipts */}
              <div>
                <input
                  type="checkbox"
                  id="users-email"
                  checked={admin}
                  onChange={(e) => setAdmin(!admin)}
                />
                <label htmlFor="users-email">
                  Send cancellation email to primary/secondary emails.
                </label>
              </div>

              {/* Checkboxes for customer receipts */}
              <div>
                <input
                  type="checkbox"
                  id="customer-email"
                  checked={customer}
                  onChange={(e) => setCustomer(!customer)}
                />
                <label htmlFor="customer-email">Send cancellation email to customer. </label>
              </div>
            </form>

            {/* Note for refunding paypal order */}
            <span>
              <p className="note-paypal">
                Note: Deleting this order will not automatically refund it to the customer. If you
                need to refund this order, you can do a manual refund by clicking{" "}
                <a href={`${PAYPAL_URL}${props.paypalId}`} target="_blank" rel="noreferrer">
                  here
                </a>
                .
              </p>
            </span>
          </div>
        </Modal.Body>

        {/* The buttons at the bottom of the modal */}
        <Modal.Footer>
          <Button
            variant="primary"
            className="menuAddButton"
            onClick={() => orderDeletion()}
            disabled={buttonDisabled}
          >
            Remove Order
          </Button>
          <Button variant="secondary" onClick={() => hideModal()} disabled={buttonDisabled}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
