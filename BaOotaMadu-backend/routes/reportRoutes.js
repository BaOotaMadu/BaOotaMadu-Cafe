// const express = require("express");
// const { getSalesReportData } = require("../controller/reportController.js");

// const router = express.Router();

// // ✅ Test route
// router.get("/test", (req, res) => {
//   res.json({ message: "Reports route is working!" });
// });

// // ✅ Main route
// router.get("/sales/:restaurantId", getSalesReportData);

// module.exports = router;
const express = require("express");
const router = express.Router();

// 🔥 Critical: This must appear in logs
console.log("✅ [REPORT ROUTE] reportRoutes.js is LOADED!");

// Test route
router.get("/test", (req, res) => {
  console.log("📩 HIT: /api/reports/test");
  res.json({ message: "Reports route is WORKING!" });
});

// Sales route
router.get("/sales/:restaurantId", (req, res) => {
  console.log("📩 HIT: /api/reports/sales/", req.params.restaurantId);
  res.json({
    message: "Sales endpoint reached",
    restaurantId: req.params.restaurantId,
    timeframe: req.query.timeframe,
    salesData: [],
    popularItems: [],
    timeframeLabel: "Last 7 Days"
  });
});

module.exports = router;