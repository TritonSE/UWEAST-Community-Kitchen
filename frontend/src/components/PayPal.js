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

// PayPal script is located in public/index.html (contains Client ID)
export default function PayPal(props) {
    const [cookies, setCookie] = useCookies(["cart"]);
    let history = useHistory();

    const { cart } = cookies.cart;

    
    //stores cookie object and function to remove cookie
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
                value: cookies.cart.total,
                breakdown: {
                    // includes totals for items and taxes. Shipping and handling can be ignored
                    // because the items are for pickup and handling is included in price
                    item_total: {
                        currency_code: "USD",
                        value: cookies.cart.subtotal,
                    },
                    tax_total: {
                        currency_code: "USD",
                        value: cookies.cart.tax,
                    },
                }
            },
            // Deals with the individual item entries for the order
            items: 
            [...cookies.cart.items.map((item) => {
                // build description
                let desc = [`Size: ${item[4]}`];
                if(item[6] !== undefined){
                    if(Array.isArray(item[6])){
                        desc = [...desc, ...item[6]];
                    }
                    else{
                        desc = [...desc, item[6]];
                    }
                }
                desc = [...desc, item[5]];
                return {
                    name: item[1],
                    // Description follows the format:
                    // Size: {size}, (Gluten Free,) (Other addons,) 
                    description: desc.join(", "),
                    unit_amount: {
                        currency_code: "USD",
                        value: (parseFloat(item[2])/parseFloat(item[3])).toFixed(2),
                    },
                    tax: {
                        currency_code: "USD",
                        value: 0,
                    },
                    quantity: item[3],
                    category: "PHYSICAL_GOODS"
                }
            }), 
                {   name: "taxes",
                    description: "taxes",
                    unit_amount: {
                        currency_code: "USD",
                        value: 0,
                    },
                    tax: {
                        currency_code: "USD",
                        value: cookies.cart.tax,
                    },
                    quantity: 1,
                    category: "PHYSICAL_GOODS"
                }
            ]
        }],
        shipping_type: 'PICKUP',
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
                    // details here includes payer name, phone number, and email

                    // create order object
                    let sendDate = new Date(props.selectedDate.getFullYear(),(props.selectedDate.getMonth()), props.selectedDate.getDate(),
                        props.selectedTime.substring(0, 2), props.selectedTime.substring(3, 5));
                    const orderObj = {
                        "Customer": {
                            "Name": details.payer.name.given_name + " " + details.payer.name.surname,
                            "Email": details.payer.email_address,
                            "Phone": details.payer.phone.phone_number.national_number
                        },
                        "Pickup": sendDate,
                        "PayPal": {
                            "Amount": parseFloat(cookies.cart.total).toFixed(2),
                            "transactionID": data.orderID
                        },
                        "Order": 
                        cookies.cart.items.map((item) => {
                            return {
                                "item": item[1],
                                "quantity": parseInt(item[3]),
                                "size": item[4],
                                "accommodations": 
                                    item[6] !== undefined
                                        ? (Array.isArray(item[6]) 
                                            ? item[6].join(",") 
                                            : item[6]
                                        )
                                        : "",
                                "specialInstructions": item[5],
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
                        let newCart = {
                            items: [],
                            subtotal: "00.00",
                            tax: "00.00",
                            total: "00.00"
                        }
                        setCookie("cart", newCart, { path: "/" });
                        //setCookie("cart");
                        
                        history.push("/");
                        history.go(0);
                    })
                    .catch(() => {
                        alert("Error...");
                    });
                });
            },
            onCancel: () => {
            },
            onError: (err) => {
                console.log(err);
                alert("An error occurred!");

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