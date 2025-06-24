const express = require("express");
const Activity = require("../models/activityModel");

const router = express.Router();

router.get("/:restaurant_id", async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const activities = await Activity.find({ restaurant_id })
      .sort({ time: -1 })
      .limit(15);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
