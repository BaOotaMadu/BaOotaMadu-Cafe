const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  name: { type: String, required: true },
 // description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  image_url: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Menu", MenuSchema);
