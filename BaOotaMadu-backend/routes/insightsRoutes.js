const express = require("express");
const router = express.Router();
const insightsController = require("../controller/insightsController");

// Get Total Orders & Sales Today
router.get("/today/:restaurantId", insightsController.getInsights);

module.exports = router;
