const express = require("express");
const paypal = require("@paypal/checkout-server-sdk");

const router = express.Router();
// THE FOLLOWING FILE ISN'T BEING USED. IT HAS IMPLEMENTATIONS FOR SERVER SIDE
// PAYMENTS, BUT THIS ISN'T BEST PRACTICE AND ONLY WORKS WITH THE OLD PAYPAL API
// I AM LEAVING THIS HERE IN CASE WE WANT TO PURSUE THIS LATER.

// const clientId = process.env.PAYPAL_CLIENT_ID;
// const clientSecret = process.env.PAYPAL_SECRET_ID;
const clientId = "";
const clientSecret = "";
/* Post route for starting the payment process. This takes in payment object
 through the request body and creates a PayPal order through the PayPal API.
 Once the order is created, we get a Payment ID, and return it to the client
 to render the payment screen.
*/
function createEnv() {
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}
function client() {
  return new paypal.core.PayPalHttpClient(createEnv());
}
router.post("/createPayment", async (req, res) => {
  // req = request
  // res = response
  // next = middleware
  try {
    const order = req.body;
    // call paypal with order object to set up transaction.
    let paypalOrderRequest = new paypal.orders.OrdersCreateRequest();
    paypalOrderRequest.headers["prefer"] = "return=representation";
    paypalOrderRequest.requestBody(order);

    const data = await client().execute(paypalOrderRequest);
    res.json({ id: data.result.id });
  } catch (err) {
    // handle any errors from the call
    console.error(err);
    return res.sendStatus(500);
  }
});
router.post("/executePayment", async (req, res, next) => {
  const orderID = req.body.orderID;
  // capture the order by calling the paypal api

  try {
    const request = new paypal.orders.OrdersAuthorizeRequest(orderId);
    request.requestBody({});
    await client()
      .execute(request)
      .then((data) => {
        res.json({ data });
        return res.sendStatus(200);
      });
  } catch (err) {
    // handle any errors from the call
    console.error(err);
    return res.sendStatus(500);
  }
});
// update with shipping costs

module.exports = router;
