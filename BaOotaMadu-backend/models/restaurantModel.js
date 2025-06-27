const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  // You can add more fields later
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
