import React from 'react'
import { PayPalButton } from "react-paypal-button-v2";

const config = require('../config');

const BACKEND_URL = config.backend.uri;

//PayPal script is located in public/index.html (contains Client ID)
export default function PayPal(props) {
    const { cart } = props;
    // I assume the cart object looks like this:
    // {
    //     cart_total: "",
    //     item_total: "",
    //     tax_total: "",
    //     items: [
    //         {
    //             name: "",
    //             quantity: "",
    //             size: "",
    //             addons: ["", ""],
    //             individual_price: "",
    //             individual_tax: "",
    //         },

    //     ]
    // }
    const paypalRef = React.useRef();
    const paypalOrderObject = {
        intent: "CAPTURE",
                
        purchase_units: [{
            description: "Food order from UWEAST Kitchen",
            // Deals with pricing of the cart
            amount: {
                currency_code: "USD",
                value: cart.cart_total,
                breakdown: {
                    // includes totals for items and taxes. Shipping and handling can be ignored
                    // because the items are for pickup and handling is included in price
                    item_total: {
                        currency_code: "USD",
                        value: cart.item_total,
                    },
                    tax_total: {
                        currency_code: "USD",
                        value: cart.tax_total,
                    },
                }
            },
            // Deals with the individual item entries for the order
            items: 
            cart.items.map((item) => {
                return {
                    name: item.name,
                    // Description follows the format:
                    // Size: {size}, (Gluten Free,) (Other addons,) 
                    description: [`Size: ${item.size}`, ...item.addons].join(", "),
                    unit_amount: {
                        currency_code: "USD",
                        value: item.individual_price,
                    },
                    tax: {
                        currency_code: "USD",
                        value: item.individual_tax,
                    },
                    quantity: item.quantity,
                    category: "PHYSICAL_GOODS"
                }
            })
        }],
        shipping_type: 'PICKUP',
        application_context: {
            shipping_preference: 'NO_SHIPPING',
        },
    }
    const createOrder = () => {
        console.log("Creating order...");
        return fetch(`${BACKEND_URL}createPayment`, {
            method: "POST",
            body: paypalOrderObject,
            headers: {
                "content-type": "application/json"
            }, 
        }).then((res) => {
            return res.id;
        })
        .catch((err) => {
            console.log(err);
            alert("Create order Error");
        })
        .then((data) => {
            console.log(data);
            return data.orderID; // make sure to use the same key name for order ID on the client and server
        });
    }
    const onAuthorize = (data) => {
        console.log("Authorizing order...");
        return fetch(`${BACKEND_URL}executePayment`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                orderID: data.orderID,
            }),
        }).then((res) => {
           // handle show completion
           return res.json();
        })
        .catch(() => {
            alert("Error");
        }).then((details) => {
            alert("Successful order!");
            console.log(details);
        });
    }

    return (
        <div>
            <PayPalButton
                createOrder={createOrder}
                onApprove={onAuthorize}
            ></PayPalButton>
        </div>
    )
}