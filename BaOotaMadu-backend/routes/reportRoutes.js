const express = require("express");
const { getSalesReportData } = require("../controller/reportController.js");
const router = express.Router();

// Actual sales route
router.get("/sales/:restaurantId", getSalesReportData);

module.exports = router;

