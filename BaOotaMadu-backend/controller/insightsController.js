
const Order = require("../models/orderModel");
const mongoose = require("mongoose");

const getInsights = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const restaurantObjectId = new mongoose.Types.ObjectId(restaurantId);

    // Start of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Total orders today (any status)
    const totalOrdersToday = await Order.countDocuments({
      restaurant_id: restaurantObjectId,
      created_at: { $gte: today }
    });

    // 2. Total revenue (only paid orders)
    const totalSalesResult = await Order.aggregate([
      {
        $match: {
          restaurant_id: restaurantObjectId,
          created_at: { $gte: today },
          payment_status: "paid" // ✅ Only paid orders
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total_amount" } // ✅ Total revenue
        }
      }
    ]);
    console.log("Total Sales Result:", totalSalesResult);

    const totalSalesToday = totalSalesResult.length > 0 ? totalSalesResult[0].total : 0;

    // 3. Pending orders today
    const pendingOrdersToday = await Order.countDocuments({
      restaurant_id: restaurantObjectId,
      status: "pending",
      created_at: { $gte: today }
    });

    // 4. Table stats
    const totalTables = await Table.countDocuments({ restaurant_id: restaurantObjectId });
    const activeTables = await Table.countDocuments({
      restaurant_id: restaurantObjectId,
      status: "occupied"
    });

    // ✅ Send response
    res.json({
      totalOrdersToday,
      totalSalesToday, // ✅ Only sum of paid orders
      pendingOrdersToday,
      totalTables,
      activeTables
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
