const express = require('express');
const paypal = require("@paypal/checkout-server-sdk");

const router = express.Router();

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_SECRET_ID;
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

/* Post route for starting the payment process. This takes in payment object
 through the request body and creates a PayPal order through the PayPal API.
 Once the order is created, we get a Payment ID, and return it to the client
 to render the payment screen.
*/
router.post('/createPayment', async (req, res) => {
    // req = request
    // res = response
    // next = middleware


    const order = req.body;
    console.log(order);
    // call paypal with order object to set up transaction. 
    try{
        let paypalOrderRequest = new paypal.orders.OrdersCreateRequest();
        paypalOrderRequest.requestAuth({
            user: clientId,
            pass: clientSecret
        });
        paypalOrderRequest.requestBody(order);
        const paypalOrderResponse = await client.execute(paypalOrderRequest);
        console.log(`Response: ${JSON.stringify(response)}`);
        const orderID = response.result.id;
        console.log(`Order:    ${JSON.stringify(response.result)}`)
        const resJson = {
            orderID
        };
        res.json(resJson);
    } catch (err) {
        console.err(err);
        return res.send(500);
    }
    
});
router.post('/executePayment', async (req, res, next) => {
    const orderID = req.body.orderID;
    // capture the order by calling the paypal api
    const captureRequest = paypal.orders.OrdersCaptureRequest(orderID);
    captureRequest.requestBody({});
    try {
        const capture = await client.execute(request);
        console.log(`Response: ${JSON.stringify(capture)}`);
        console.log(`Capture: ${JSON.stringify(capture.result)}`);
        const result = capture.result;
        const resJson = {
            result
        };
        res.json(resJson);
    } catch (err) {
        // Handle any errors from the call
        console.error(err);
        return res.send(500);
    }
});
//update with shipping costs

module.exports = router;