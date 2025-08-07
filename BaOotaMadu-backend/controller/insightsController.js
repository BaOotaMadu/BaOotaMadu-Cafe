const Order = require("../models/orderModel");
const mongoose = require("mongoose");
const Table = require("../models/tableModel");

const getInsights = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const restaurantObjectId = new mongoose.Types.ObjectId(restaurantId);

    // Start of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total orders today
    const totalOrdersToday = await Order.countDocuments({
      restaurant_id: restaurantObjectId,
      created_at: { $gte: today }
    });

    // Total sales today
   const totalSalesResult = await Order.aggregate([
  {
    $match: {
      restaurant_id: restaurantObjectId,
      created_at: { $gte: today },
      payment_status: "paid" // Only include paid orders
    }
  },
  {
    $group: {
      _id: null,
      total: { $sum: "$total_amount" }
    }
  }
]);


    // Pending orders today
    const pendingOrdersToday = await Order.countDocuments({
      restaurant_id: restaurantObjectId,
      status: "pending",
      created_at: { $gte: today }
    });
// Total tables in the restaurant
const totalTables = await Table.countDocuments({ restaurant_id: restaurantObjectId });

// Active tables = those with status 'occupied'
const activeTables = await Table.countDocuments({ 
  restaurant_id: restaurantObjectId, 
  status: "occupied" 
});
console.log("Total Tables:", totalTables);
console.log("Active Tables:", activeTables);

    // Final response
    res.json({
      totalOrdersToday,
      totalSalesToday: totalSalesResult.length > 0 ? totalSalesResult[0].total : 0,
      pendingOrdersToday,
     // activeOrdersToday,
      totalTables,
      activeTables,
    });

  } catch (err) {
    console.error("Error fetching insights:", err);
    res.status(500).json({
      message: "Error fetching insights",
      error: err.message
    });
  }
};

module.exports = { getInsights };
