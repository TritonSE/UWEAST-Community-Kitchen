import React from 'react'
const paypal = require("@paypal/checkout-server-sdk");

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
        application_context: {
            shipping_preference: 'NO_SHIPPING',
            return_url: "https://www.example.com",
            cancel_url: "https://www.example.com"
        },
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
    }
    const createOrder = async () => {
        console.log("Creating order...");
        return fetch(`${BACKEND_URL}paypal/createPayment`, {
            method: "POST",
            body: JSON.stringify(paypalOrderObject),
            headers: {
                "content-type": "application/json"
            }, 
        }).then((res) => {
            if(res.ok) {
                return res.json();
            }
        }).then((data) => {
            console.log("finished creating order")
            return data.orderID; // make sure to use the same key name for order ID on the client and server
        })
        .catch((err) => {
            console.log(err);
            alert("Create order Error");
        });
    }
    const onApprove = async (data) => {
        console.log("Authorizing order...");
        return fetch(`${BACKEND_URL}paypal/executePayment`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                orderID: data.orderID,
            }),
        }).then((res) => {
           // handle show completion
           console.log("ORDER COMPLETE!");
           return res.json();
        })
        .catch(() => {
            alert("Error");
        }).then((details) => {
            alert("Successful order!");
            console.log(details);
        });
    }

     // To show PayPal buttons once the component loads
    React.useEffect(() => {
        window.paypal
        .Buttons({
            createOrder: async(data, actions) => {
                return actions.order.create(paypalOrderObject);
            },
            onApprove: async (data, actions) => {
                return actions.order.capture().then(function(details) {
                    // Details here includes payer name, phone number, and email.
                    // Give this info to the backend so they can send another email!
                    alert('Transaction completed by ' + details.payer.name.given_name + '!');
                });
            },
            onError: (err) => {
                console.error(err);
            },
        })
        .render(paypalRef.current);
    }, [cart]);

    return (
        <div>
            <div ref={paypalRef}/>
        </div>
    )
}