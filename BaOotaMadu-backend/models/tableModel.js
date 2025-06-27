const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  table_number: { type: Number, required: true },
  qr_code: { type: String, required: false, unique: true, sparse: true }, // Store QR URL
  capacity: { type: Number, required: true },
  status: { type: String, enum: ["available", "occupied"], default: "available" },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Table", TableSchema);
