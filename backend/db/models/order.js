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
    Order: [{ item: String, quantity: Number, extra: [String], size: String }],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = { Order };
