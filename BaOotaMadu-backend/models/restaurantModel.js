const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  //owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },
  location: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
