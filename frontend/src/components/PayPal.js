import React from 'react'

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

     // To show PayPal buttons once the component loads
    React.useEffect(() => {
        window.paypal
        .Buttons({
            createOrder: (data, actions) => {
            return actions.order.create({
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
            });
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