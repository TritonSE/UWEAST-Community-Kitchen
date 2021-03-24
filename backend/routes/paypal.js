const express = require("express");
var querystring = require('querystring');
var request = require('request');
const { updatePayPalStatus, findOrderByTid } = require("../db/services/order");
const { findAllEmails } = require("../db/services/email");
const { getAllMenuItems } = require("../db/services/item");
const { sendEmail } = require("../routes/services/mailer");
const config = require("../config");
const router = express.Router();

const TAX_RATE = 0.0775; 

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
  sendEmail("uweast-order-rejection", dbemail, locals, res);

}

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

async function priceValidation(order, payment_amount, txn_id, res){
  let menuItems = await getAllMenuItems();
   let dict_menuItems = {};
   for(var j = 0; j < menuItems.length; j++){ 
     dict_menuItems[menuItems[j]["Name"]] = menuItems[j];
    }

   let expected_total = 0;
   for(var i=0; i < order.Order.length; i++){
     let item_name = order.Order[i]["item"];

     try{
      let quantity = order.Order[i]["quantity"];
      let size = order.Order[i]["size"];
      let accommodations = order.Order[i]["accommodations"].split(', ');
      if(accommodations.length === 1 && accommodations[0] === ''){
        accommodations = [];
      }

      let item_object = dict_menuItems[item_name];

      let item_price = parseFloat(item_object["Prices"][size]);

      for(var k = 0; k < accommodations.length; k++){

        let accom_price = parseFloat(getAccomPrice(accommodations[k], item_object["Accommodations"]));
        item_price += accom_price;
      }

      item_price *= quantity;

      expected_total += item_price;
     } catch(err){
      //console.log("Rejected: Bad Price Verification");
      await updatePayPalStatus(order._id, 2);
      let locals = {
        transactionID: txn_id,
        verified: true,
        reason: "CONTENTS",
        expected_amount: expected_total,
        actual_amount: payment_amount
      }
      setUpEmail(locals,res);
      return true;
     }

   }

   expected_total += (expected_total * TAX_RATE)
   expected_total = expected_total.toFixed(2);


   if(expected_total != payment_amount){
    // console.log("Rejected: Expected not equal to Total Paid");
    await updatePayPalStatus(order._id, 2);
    let locals = {
      transactionID: txn_id,
      verified: true,
      reason: "PRICE",
      expected_amount: expected_total,
      actual_amount: payment_amount
    }
    setUpEmail(locals,res);
    return true;
   }

   return false;
}


async function inspectValidIPNResponse(req, res){

   // assign posted variables to local variables
   var payment_status = req.body['payment_status'];
   var txn_id = req.body['txn_id'];
   var receiver_email = req.body['receiver_email'];
   var payment_amount = req.body['mc_gross'];

   // only proceed if the transaction has been fully completed, and transaction comes from the right merchant
   if(payment_status != 'Completed'){
    //  console.log(payment_status);
     //console.log("Rejected: Status");
     return;
   }

   if(receiver_email != config.paypal.PAYPAL_ClIENT_EMAIL){
    //console.log("Rejected: Email");
    return;
  }

   // try to find the corresponding order in the database
   let order = await findOrderByTid(txn_id);
   if(!order){
      //console.log("Rejected: Order does not exist");
      return;
   }

   // verify gross amount paid are same 
   if(payment_amount != order.PayPal.Amount){
    //console.log("Rejected: Mismatched paid amount");
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

   // verify order total is correct based off of items bought 
   if(await priceValidation(order, payment_amount, txn_id, res)){
     return;
   }

   // order already marked bad, return 
   if(order.PayPal.status === 2){
     return;
   }

  // approve order
  await updatePayPalStatus(order._id, 1);
  console.log("Approved!");
  return;

}

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
     console.error('Invalid IPN!'.error);
}

router.post(
  "/ipn-listener",
  async (req, res, next) => {

    res.sendStatus(200);
    res.end();

    let isProduction = false;
  
    let strSimulator  = "https://ipnpb.sandbox.paypal.com/cgi-bin/webscr";
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

      // Step 2: POST IPN data back to PayPal to validate
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
      if(error){
        console.error("Could not make handshake request to PayPal");
        return;
      }

      if (!error && response.statusCode === 200) {
  
        // inspect IPN validation result and act accordingly
        if (body.substring(0, 8) === 'VERIFIED') {

          inspectValidIPNResponse(req, res);

        } else if (body.substring(0, 7) === 'INVALID') {
            inspectInvalidIPNResponse(req, res)
        }
      }
    });
  }
);


module.exports = router;
