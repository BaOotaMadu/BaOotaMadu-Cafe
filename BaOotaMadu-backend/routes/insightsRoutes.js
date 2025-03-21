const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel.js");

// Get Total Orders & Sales Today
router.get("/today/:restaurantId", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    console.log(`Fetching insights for restaurantId: ${req.params.restaurantId}`);
    console.log(`Today's date (start of the day): ${today}`);

    // Fetch total orders for today
    const totalOrders = await Order.countDocuments({
      restaurantId: req.params.restaurantId,
      createdAt: { $gte: today }
    });
    
    console.log(`Total Orders for today: ${totalOrders}`);

    // Fetch total sales for today
    const totalSales = await Order.aggregate([
      { 
        $match: { 
          restaurantId: req.params.restaurantId, 
          createdAt: { $gte: today } 
        } 
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    console.log(`Total Sales Aggregation Result: `, totalSales);

    res.status(200).json({
      totalOrders,
      totalSales: totalSales[0]?.total || 0
    });
  } catch (error) {
    console.error("Error fetching today's insights:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
