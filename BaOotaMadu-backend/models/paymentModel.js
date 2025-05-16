const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["card", "cash", "UPI"], required: true },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  transaction_id: { type: String, unique: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);
