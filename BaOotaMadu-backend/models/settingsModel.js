const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true, unique: true },
  restaurantName: String,
  slogan: String,
  address: String,
  phone: String,
  logoUrl: String,
  // Add any other settings fields as needed
}, { timestamps: true });

module.exports = mongoose.model("Settings", SettingsSchema);