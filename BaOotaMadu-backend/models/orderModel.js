const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  tokenNumber: { type: Number, required: true },
  customer_name: { type: String },
  order_items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, // Stores price at order time
    },
  ],
  total_amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "preparing", "served", "completed"],
    default: "pending",
  },
  payment_status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
