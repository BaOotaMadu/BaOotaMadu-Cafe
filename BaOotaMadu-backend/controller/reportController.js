const mongoose = require("mongoose");
const Order = require("../models/orderModel");

// Helper: Get start date based on timeframe
const getDateRange = (timeframe) => {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));

  switch (timeframe) {
    case "day":
      return startOfDay;
    case "week":
      // Start of this week (Sunday)
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      return startOfWeek;
    case "month":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case "year":
      return new Date(now.getFullYear(), 0, 1);
    default:
      return startOfDay; // fallback
  }
};

const getSalesReportData = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { timeframe = "week" } = req.query;

    // Validate restaurantId
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const restaurantObjectId = new mongoose.Types.ObjectId(restaurantId);
    const startDate = getDateRange(timeframe);

    // 1. Sales Data by Date
    const salesAggregation = await Order.aggregate([
      {
        $match: {
          restaurant_id: restaurantObjectId,
          created_at: { $gte: startDate },
          payment_status: "paid",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$created_at" },
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$total_amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format dates like "Mon, Mar 10"
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const salesData = salesAggregation.map((item) => {
      const date = new Date(item._id);
      const dayName = dayNames[date.getDay()];
      const monthName = monthNames[date.getMonth()];
      const dayNum = date.getDate();

      return {
        date: `${dayName}, ${monthName} ${dayNum}`,
        orders: item.orders,
        revenue: item.revenue,
        avgOrder: parseFloat((item.revenue / item.orders).toFixed(2)),
      };
    });

    // 2. Popular Items
    const popularItemsAggregation = await Order.aggregate([
      {
        $match: {
          restaurant_id: restaurantObjectId,
          created_at: { $gte: startDate },
          payment_status: "paid",
          items: { $exists: true, $ne: [] },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          category: { $first: "$items.category" },
          totalQuantity: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]);

    const popularItems = popularItemsAggregation.map((item) => ({
      name: item._id,
      category: item.category || "Uncategorized",
      orders: item.totalQuantity,
      revenue: item.revenue,
    }));

    // Timeframe label
    const timeframeLabel = {
      day: "Today",
      week: "Last 7 Days",
      month: "This Month",
      year: "This Year",
    }[timeframe];

    // Send response
    res.json({ salesData, popularItems, timeframeLabel });
  } catch (err) {
    console.error("Error in getSalesReportData:", err);
    res.status(500).json({
      message: "Failed to fetch report data",
      error: err.message,
    });
  }
};

module.exports = { getSalesReportData };
