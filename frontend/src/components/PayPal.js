/**
 * This file contains the code for the PayPal Smart Buttons integration.
 * It calls the backend once an order is completed to create a new order object.
 * The expected form of the props is shown below.
 *
 * @summary Renders paypal buttons for payment based on cart passed in through props
 * @author PatrickBrown1
 */
import React from 'react'
import { useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';

const config = require('../config');

const BACKEND_URL = config.backend.uri;

//PayPal script is located in public/index.html (contains Client ID)
export default function PayPal(props) {
    const { cart } = props;
    let history = useHistory();
    
    //stores cookie object and function to remove cookie
    const [cookies, removeCookie] = useCookies(["cart"]);
    // I assume the cart object looks like this:
    // {
    //     cart_total: "",
    //     item_total: "",
    //     tax_total: "",
    //     items: [
    //         {
    //             price: "12.23"
    //             quantity: "",
    //             size: "",
    //             accommodations: ["", ""] (string if only one, prop doesn't exist if none),
    //             instructions: "",
    //             
    //             "popupValues": 
    //                  {
    //                      "title":"Caesar Salad",
    //                      "description":"Romaine lettuce with argula and spinach, served with a drizzle of olive oil!",
    //                      "price": {"Individual":"8.23"},
    //                      "image":"https://natashaskitchen.com/wp-content/uploads/2019/01/Caesar-Salad-Recipe-3.jpg",
    //                      "dietary-info":
    //                          {
    //                              "vegan":true,
    //                              "vegetarian":true,
    //                              "glutenFree":true,
    //                              "containsDairy":false
    //                          },
    //              "accommodations":[
    //                  {"_id":"602cd4994cca295f7648f2e0","Description":"Add Chicken Breasts","Price":"4.00"},
    //                  {"_id":"602cd4994cca295f7648f2e1","Description":"Subsitute with Ranch dressing","Price":"0.00"},
    //                  {"_id":"602cd4994cca295f7648f2e2","Description":"Add Garlic Croutons","Price":"0.50"},
    //                  {"_id":"602cd4994cca295f7648f2e3","Description":"Substitute with Greek Dressing","Price":"0.75"}]}"
    //              ]
    //     }],
    //     pickup_date: "",
    //     pickup_time: "",
    // }
    const paypalRef = React.useRef();
    const paypalOrderObject = {
        intent: "CAPTURE",
        application_context: {
            shipping_preference: 'NO_SHIPPING',
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
                // build description
                let desc = [`Size: ${item.size}`];
                if(item.accommodations !== undefined){
                    if(Array.isArray(item.accommodations)){
                        desc = [...desc, ...item.accommodations];
                    }
                    else{
                        desc = [...desc, item.accommodations];
                    }
                }
                desc = [...desc, item.instructions];
                return {
                    name: item.popupValues.title,
                    // Description follows the format:
                    // Size: {size}, (Gluten Free,) (Other addons,) 
                    description: desc.join(", "),
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
    // THE FOLLOWING TWO METHODS ARE NOT USED. THEY WERE CREATED FOR
    // SERVER SIDE PAYMENT INTEGRATION, BUT THIS ISN'T BEST PRACTICE,
    // SO IT WAS NOT PURSUED. THEREFORE THESE METHODS ARE COMMENTED OUT.
    /* const createOrder = async () => {
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
    } */

     // To show PayPal buttons once the component loads
    React.useEffect(() => {
        window.paypal
        .Buttons({
            createOrder: async(data, actions) => {
                return actions.order.create(paypalOrderObject);
            },
            onApprove: async (data, actions) => {
                return actions.order.capture().then(function(details) {
                    // details here includes payer name, phone number, and email

                    // create order object
                    let sendDate = new Date((cart.pickup_date.getMonth()+1) + ' ' + cart.pickup_date.getDate() + ', ' + cart.pickup_date.getFullYear() + ' ' + cart.pickup_time)
                    const orderObj = {
                        "Customer": {
                            "Name": details.payer.name.given_name + " " + details.payer.name.surname,
                            "Email": details.payer.email_address,
                            "Phone": details.payer.phone.phone_number.national_number
                        },
                        "Pickup": sendDate,
                        "PayPal": {
                            "Amount": cart.cart_total,
                            "transactionID": details.id
                        },
                        "Order": 
                        cart.items.map((item) => {
                            return {
                                "item": item.popupValues.title,
                                "quantity": item.quantity,
                                "size": item.size,
                                "accommodations": 
                                    item.accommodations !== undefined
                                        ? (Array.isArray(item.accommodations) 
                                            ? item.accommodations.join(",") 
                                            : item.accommodations
                                        )
                                        : "",
                                "specialInstructions": item.instructions,
                            }
                        })
                    }
                    // signal email automation by calling the /autoEmails/automate route, 
                    // this will automatically add the order to the database 
                    return fetch(`${BACKEND_URL}autoEmails/automate`, {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                        },
                        body: JSON.stringify(orderObj),
                    }).then((res) => {
                        if(res.ok){
                            alert('Transaction completed! You will receive a confirmation email shortly.');
                        } else {
                            alert('Transaction completed, but email automation failed. You paid for your meal, and should get a confirmation from PayPal');
                        }
                        //clears the cart cookie after order is placed
                        removeCookie("cart");
                        history.push("/");
                    })
                    .catch(() => {
                        alert("Error");
                    });
                });
            },
            onCancel: () => {
                // If the user cancels their order, send them back to the cart summary
                // The cart summary exists at the menu page
                history.push("/");
            },
            onError: (err) => {
                alert("An error occurred!");
                history.push("/");

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