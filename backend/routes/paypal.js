const express = require('express');
const paypal = require("@paypal/checkout-server-sdk");

const router = express.Router();

// const clientId = process.env.PAYPAL_CLIENT_ID;
// const clientSecret = process.env.PAYPAL_SECRET_ID;
const clientId = "AZIQD_bt5g6zbU_22BfYx8aGx3MvNCS1jbPHvJg-DVkVhzO3ooFXTGJ4Lm1rRRp0xp4d2uiNu9JkcCUz";
const clientSecret = "EHDSz4JHWOx3VMR15YC6oVQF_WrGCcq5DEq6E4mHrKUBbuZthvKBdPWO0hLHnWse1F0iKWwJQlVUIvuZ";
/* Post route for starting the payment process. This takes in payment object
 through the request body and creates a PayPal order through the PayPal API.
 Once the order is created, we get a Payment ID, and return it to the client
 to render the payment screen.
*/
function createEnv(){
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}
function client(){
    return new paypal.core.PayPalHttpClient(createEnv());
}
router.post('/createPayment', async (req, res) => {
    // req = request
    // res = response
    // next = middleware
    try {
        const order = req.body;
        console.log(order);
        // call paypal with order object to set up transaction. 
        let paypalOrderRequest = new paypal.orders.OrdersCreateRequest();
        paypalOrderRequest.headers["prefer"] = 'return=representation';
        paypalOrderRequest.requestBody(order);  

        const data = await client().execute(paypalOrderRequest);
        res.json({id: data.result.id});
    } catch (err) {
        // 4. Handle any errors from the call
        console.error(err);
        return res.sendStatus(500);
    }
});
router.post('/executePayment', async (req, res, next) => {
    const orderID = req.body.orderID;
    console.log(orderID);
    // capture the order by calling the paypal api
    
    try {
        console.log("a");
        const request = new paypal.orders.OrdersAuthorizeRequest(orderId);
        console.log("b");
        request.requestBody({});
        console.log("start");
        await client().execute(request)
        .then((data) => {
            console.log("done");
            console.log(data);
            res.json({data});
            return res.sendStatus(200);
        });
    } catch (err) {
        // Handle any errors from the call
        console.error(err);
        return res.sendStatus(500)
    }
});
//update with shipping costs

module.exports = router;