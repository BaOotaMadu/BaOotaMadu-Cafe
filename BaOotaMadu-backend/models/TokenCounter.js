// models/TokenCounter.js
const mongoose = require("mongoose");

const TokenCounterSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // YYYY-MM-DD
  lastToken: { type: Number, default: 0 },
});

module.exports = mongoose.model("TokenCounter", TokenCounterSchema);
