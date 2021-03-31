/**
 * This file is responsible for PayPal related functionality, namely validating orders before
 * PayPal smart buttons are enabled and an PayPal IPN listener that listens for approved transactions
 * from PayPal's servers, after they have been made through the main website. Both routes are
 * security counter-measures, checking for proper and valid payment. 
 *
 * @summary   Code for routes involved with PayPal Smart Buttons/Server.
 * @author    Amrit Kaur Singh
 */

const express = require("express");
var querystring = require('querystring');
const { body } = require("express-validator");
var request = require('request');
const { isValidated } = require("../middleware/validation");
const { updatePayPalStatus, findOrderByTid } = require("../db/services/order");
const { findAllEmails } = require("../db/services/email");
const { getAllMenuItems } = require("../db/services/item");
const { sendEmail } = require("../routes/services/mailer");
const {ORDER_SERVICE_TAX_RATE, MIN_CART_TOTAL_CHECKOUT} = require('../util/constants.js');
const config = require("../config");
const router = express.Router();

// sends email to UWEAST admins notifiying of a rejection order
async function setUpEmail(data, res){
  // retrieve all emails inside of Emails DB
  const emails = await findAllEmails();
  if (!emails.length) {
    return res.status(400).json({ errors: [{ msg: "no emails found" }] });
  }

  dbemail = emails.map(function (item) {
    return item.email;
  });

  let locals = {
    transactionID: data.transactionID || "",
    verified: data.verified || false,
    reason: data.reason || "",
    expected_amount: data.expected_amount || "",
    actual_amount: data.actual_amount || ""
  }

  // send UWEAST a notification that an order has been rejected
  await sendEmail("uweast-order-rejection", dbemail, locals, res);

}

/**
 * Helper function that inspects a valid response from PayPal for a specific transaction. Checks transaction to make
 * sure payment is completed (money is guranteed to be received), and amount paid matches with database records. 
 * Updates corresponding order's PayPal status in database to either accepted or rejected. 
 * 
 * @param {*} req - A request containing all transaction information from PayPal for a specific order 
 * @param {*} res - Response to send back 
 */
async function inspectValidIPNResponse(req, res){

   // assign posted variables to local variables
   var payment_status = req.body['payment_status'];
   var txn_id = req.body['txn_id'];
   var txn_type = req.body['txn_type'];
   var receiver_email = req.body['receiver_email'];
   var payment_amount = req.body['mc_gross'];

   // only proceed if the checkout transaction has been fully completed, and transaction comes from the right merchant

   if(payment_status != 'Completed' && payment_status != 'Refunded'){
     return;
   }

   console.log(`Status: ${payment_status} & TID: ${txn_id}`);

   if(receiver_email != config.paypal.PAYPAL_ClIENT_EMAIL){
    return;
  }

   // try to find the corresponding order in the database
   let order = await findOrderByTid(txn_id);
   if(!order){
      console.log(`No such TID in DB.`);
      return;
   }

   // process refund 
   if(payment_status === 'Refunded'){
    await updatePayPalStatus(order._id, 3);
    return;
   }

   // order already marked bad, return 
   if(order.PayPal.status === 2){
    return;
  }

   // verify gross amount paid are same 
   if(payment_amount != order.PayPal.Amount){
    await updatePayPalStatus(order._id, 2);
    let locals = {
      transactionID: txn_id,
      verified: true,
      reason: "MISMATCH",
      expected_amount: order.PayPal.Amount,
      actual_amount: payment_amount
    }
    setUpEmail(locals,res);
    return;
   }

  // approve order
  await updatePayPalStatus(order._id, 1);
}

/**
 * Helper function that inspects an invalid response from PayPal for a specific transaction. It checks to see if 
 * the transaction exists in the database, changing its status to rejected if it does. 
 * 
 * @param {*} req - A request containing all transaction information from PayPal for a specific order 
 * @param {*} res - Response to send back 
 */
async function inspectInvalidIPNResponse(req, res){
     // try to find the corresponding order in the database
     let txn_id = req.body['txn_id']; 
     let order = await findOrderByTid(txn_id);
     if(!order || order.PayPal.status === 2){

         return;
     }
     await updatePayPalStatus(order._id, 2);
     let locals = {
       transactionID: txn_id,
       verified: false
     }
     setUpEmail(locals,res);
     // IPN invalid, log for manual investigation
}

/**
 * PayPal IPN listener route implemented, essentially waits for PayPal IPN to notify this route once it receives an
 * order confirmation for payment on their server. It follows the IPN validation process, sending a 200 response back
 * as well a validation step back to PayPal's server to verify that the route was indeed called by PayPal and 
 * transaction details can be validated. Once approved, it then confirms validation details and updates the corresponding
 * order's paypal status in the database - approved or rejected. Note, all orders placed into database are set to a default
 * pending paypal status. 
 * 
 * All orders with approved paypal status ensure that they have received proper payment through PayPal, and are thereby
 * "valid" orders. All orders with prolonged "pending" or "rejected" statuses indicate possibly fraudy orders that
 * were placed in the database by 3rd party intervention, as the PayPal IPN never calls to update their statuses. 
 * Hence, the IPN process serves as a security counter-measure for order authentication. 
 *
 */
router.post(
  "/ipn-listener",
  async (req, res, next) => {

    // send 200 response status to indicate the ping has been received (and halt future pings for same transaction)
    res.sendStatus(200);
    res.end();

    // determine URL based off of config file (production vs development)
    let isProduction = config.app.env === 'development' ? false:true;
    isProduction = false;
  
    // development utilizes sandbox testing
    let strSimulator  = "https://ipnpb.sandbox.paypal.com/cgi-bin/webscr";
    // production utilizes live url 
    let strLive = "https://ipnpb.paypal.com/cgi-bin/webscr";
    let paypalURL = strSimulator;
    
    if (isProduction)  paypalURL = strLive;

    // read the IPN message sent from PayPal and prepend 'cmd=_notify-validate'
    let payload = 'cmd=_notify-validate';

    req.body = JSON.parse(JSON.stringify(req.body));
    for (var key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        var value = querystring.escape(req.body[key]);
        payload = payload + "&" + key + "=" + value;
      }
    }
  
    var options =
      {
        "method" : "post",
        "payload" : payload,
      };

    // post IPN data back to PayPal to validate
    var options = {
      url: paypalURL,
      method: 'POST',
      headers: {
        'Connection': 'close'
      },
      body: payload,
      strictSSL: true,
      rejectUnauthorized: false,
      requestCert: true,
      agent: false
    };


    request(options, function callback(error, response, body) {
      // error occurred 
      if(error){
        console.error("Could not make handshake request to PayPal");
        return;
      }

      // PayPal responded back 
      if (!error && response.statusCode === 200) {
  
        // successful validation - inspect IPN validation result and act accordingly
        if (body.substring(0, 8) === 'VERIFIED') {

          inspectValidIPNResponse(req, res);
        
        // unsuccessful validation 
        } else if (body.substring(0, 7) === 'INVALID') {
            inspectInvalidIPNResponse(req, res)
        }
      }
    });
  }
);

// helper function that gets the price of the accomodation, if it exists
function getAccomPrice(acc, arr){
  for(var i = 0; i < arr.length; i++)
  {
    if(arr[i].Description == acc)
    {
      return arr[i].Price;
    }
  }

  throw 500;
}

/**
 * Helper function that is responsible for validating a certain order, checking for valid items in order, and
 * that the total price of the order (how much should be paid) matches with the amount the user is actually 
 * paying (how much is actually being paid).
 * 
 * @param {JSON Object} order - Order to validate
 * @param {Float} payment_amount - Current amount user is paying for this order
 * @returns {Boolean} - True indicates valid order, false indicates faulty order 
 */
async function validatePrice(order, payment_amount){

  // compose a dictionary of all items in database, with key = id and value being JSON object
  let menuItems = await getAllMenuItems();
   let dict_menuItems = {};
   for(var j = 0; j < menuItems.length; j++){ 
     dict_menuItems[menuItems[j]["_id"]] = menuItems[j];
  }

  // determine how much should be paid for these items using database prices
   let expected_total = 0;
   let expected_tax = 0;
   for(var i=0; i < order.length; i++){
     // get order item to inspect via its id
     let item_id = order[i]["id"];

     try{
      // extract relevent order information that would influence final price 
      let quantity = order[i]["quantity"];
      let size = order[i]["size"];
      let accommodations = order[i]["accommodations"];
      if(accommodations === ''){
        accommodations = [];
      } else {
         accommodations = order[i]["accommodations"].split(',');
      }


      // get the corresponding item object from DB
      let item_object = dict_menuItems[item_id];

      // size price
      let item_price = parseFloat(item_object["Prices"][size]);

      // add to base price by accommodations chosen 
      for(var k = 0; k < accommodations.length; k++){
        let accom_price = parseFloat(getAccomPrice(accommodations[k], item_object["Accommodations"]));
        item_price += accom_price;
      }

      // multiply base price using quantity 
      item_price *= quantity;

      // update total cart price 
      expected_total = (parseFloat(expected_total) + item_price).toFixed(2);

       // update total cart price to include tax
      expected_tax = (expected_total * ORDER_SERVICE_TAX_RATE).toFixed(2);

     } catch(err){
      return false;
     }

   }

   let total = (parseFloat(expected_total) + parseFloat(expected_tax)).toFixed(2);

   if(total != payment_amount.toFixed(2)){
    return false;
   }

   return true;
};

/**
 * Validates a given order, ensuring all items/accomodations/prices in the order exist within the database, and the
 * calculated cost of the order (including tax) matches the amount that the user is about to pay for it, as well as meeting the minimum
 * cart total required for checkout. This route is called by the PayPal buttons before checkout process is displayed to user, 
 * erroring out the checkout process if this route does not approve the validation. 
 *
 * @body - Requires the order and the total payment amount currently given to PayPal
 * @returns {status/object} - Successful validation (approved) sends a 200 response / unsuccessful an error status is sent
 */
router.post(
  "/validate",
  [
    body("Order").notEmpty(),
    body("Amount").notEmpty(),
    isValidated,
  ],
  async (req, res, next) => {

    let valid_order = await validatePrice(req.body.Order, parseFloat(req.body.Amount));

    // validate order cost
    if(!valid_order){
      return res.status(400).json({ errors: [{ msg: "Invalid Order" }] });
    }

    // validate it meets minimum amount
    if(parseFloat(req.body.Amount) < MIN_CART_TOTAL_CHECKOUT){
      return res.status(400).json({ errors: [{ msg: "Insufficient Amount" }] });
    }

    return res.status(200).json({ success: true });;

  }
);


module.exports = router;
