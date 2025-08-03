const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  answer: {
    type: String,
    required: [false, "Answer is required"],
  },
  name: String,
  manager: String,
  slogan: String,
  address: String,
  plan: {
    type: String,
    enum: ["Basic", "Pro", "Enterprise"],
    default: "Basic",
  },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
