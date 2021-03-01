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
