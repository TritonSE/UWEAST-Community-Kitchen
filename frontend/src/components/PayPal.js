import React from 'react'

//PayPal script is located in public/index.html (contains Client ID)
export default function PayPal(props) {
    const paypalRef = React.useRef();


     // To show PayPal buttons once the component loads
    React.useEffect(() => {
        window.paypal
        .Buttons({
            createOrder: (data, actions) => {
            return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                {
                    description: "UWEAST",
                    amount: {
                        currency_code: "USD",
                        value: props.amount,
                        // breakdown: {
                        //     item_total: {
                        //         currency_code: "USD",
                        //         value: 7.0
                        //     },
                        //     // tax_total: {
                        //     //     currency_code: "USD",
                        //     //     value: 3.0
                        //     // }
                        // }
                    },
                    
                    // item_list: {
                    //     items: [
                    //       {
                    //           name: 'Shirt',
                    //           description: 'Wonderful shirt',
                    //           quantity: '1',
                    //           unit_amount: {
                    //               value: "5.0",
                    //               currency_code: "USD"
                    //           }
                    //       },
                    //       {
                    //         name: 'Jeans',
                    //         description: 'Nice and ripped',
                    //         quantity: '2',
                    //         unit_amount: {
                    //             value: "1.0",
                    //             currency_code: "USD"
                    //         }
                    //     },
                    //     ]
                    // }
                }],
                shipping_type: 'PICKUP',
                application_context: {
                    shipping_preference: 'NO_SHIPPING',
                }
            });
            },
            onApprove: async (data, actions) => {
                return actions.order.capture().then(function(details) {
                    alert('Transaction completed by ' + details.payer.name.given_name + '!');
                });
            },
            onError: (err) => {
                console.error(err);
            },
        })
        .render(paypalRef.current);
    }, []);

    return (
        <div>
            <div ref={paypalRef}/>
        </div>
    )
}