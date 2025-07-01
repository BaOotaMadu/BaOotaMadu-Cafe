const Order = require("../models/orderModel");
const mongoose = require("mongoose");

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
          created_at: { $gte: today }
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

    // Final response
    res.json({
      totalOrdersToday,
      totalSalesToday: totalSalesResult.length > 0 ? totalSalesResult[0].total : 0,
      pendingOrdersToday
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
