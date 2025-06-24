const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  message: { type: String, required: true },
  time: { type: Date, default: Date.now },
  type: { type: String }, // optional: e.g., "order", "status", etc.
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' } // optional
});

module.exports = mongoose.model("Activity", activitySchema);
