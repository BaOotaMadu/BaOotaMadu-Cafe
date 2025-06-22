const Order = require("../models/orderModel"); 
const mongoose = require("mongoose");

const getInsights = async (req, res) => {
  try {
    //console.log("MongoDB connected:", mongoose.connection.host);
    //console.log("Fetching insights for restaurantId:", req.params.restaurantId);

    const restaurantId = req.params.restaurantId;
    //console.log("restaurantId param:", restaurantId);

    const allOrders = await Order.find({ restaurant_id: restaurantId });
    //console.log("All orders:", allOrders);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // midnight today

    const totalOrders = await Order.countDocuments({
      restaurant_id: new mongoose.Types.ObjectId(restaurantId),
      created_at: { $gte: today }
    });

    // ✅ Total sales aggregation
    const totalSales = await Order.aggregate([
      {
        $match: {
          restaurant_id: new mongoose.Types.ObjectId(restaurantId),
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

    console.log("Total Orders for today:", totalOrders);
    console.log("Total Sales Aggregation Result: ", totalSales);

    const pendingOrders = allOrders.filter(order => order.status === "pending");

    res.json({
      totalOrdersToday: totalOrders,
      totalSalesToday: totalSales.length > 0 ? totalSales[0].total : 0,
      pendingOrders: pendingOrders.length,
      allOrders: allOrders
    });

  } catch (err) {
    console.error("Error fetching insights:", err);
    res.status(500).json({ message: "Error fetching insights", error: err.message });
  }
};

module.exports = { getInsights };
