/**
 * File sets up the menuImage order schema.
 *
 * @summary   Creation of the Order DB.
 */
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    Customer: {
      Name: { type: String, required: true },
      Email: { type: String, required: true },
      Phone: { type: String, required: true },
    },
    Pickup: { type: Date, required: true },
    PayPal: {
      Amount: { type: String, required: true },
      transactionID: { type: String, required: true },
      // 0 - Pending PayPal IPN verfication (Pending)
      // 1 - PayPal IPN verified order (Approved)
      // 2 - Bad Order that most likely got past site security, such as inconsistent price total (Rejected)
      status: {type: Number, default: 0}
    },
    Order: [
      {
        item: { type: String, required: true },
        quantity: { type: Number, required: true },
        size: { type: String, required: true },
        accommodations: { type: String, default: "" },
        specialInstructions: { type: String, default: "" },
      },
    ],
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = { Order };
