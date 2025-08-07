const Order = require("../models/orderModel");
const Table = require("../models/tableModel");
const Activity = require("../models/activityModel");
const mongoose = require("mongoose");

let io;

const setIO = (ioInstance) => {
  io = ioInstance;
};

const logActivity = async (message, restaurant_id, type = "info") => {
  const activity = {
    message,
    restaurant_id,
    type,
    time: new Date(),
  };

  if (io) {
    io.emit("updateRecent", activity); // Broadcast activity update
  }

  await Activity.create(activity);
};

const placeOrder = async (req, res) => {
  try {
    const { restaurant_id, table_id, customer_name, order_items } = req.body;

    if (!table_id || !order_items?.length) {
      return res
        .status(400)
        .json({ message: "Table ID and order items are required." });
    }

    const total_amount = order_items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = await Order.create({
      restaurant_id,
      table_id,
      customer_name,
      order_items,
      total_amount,
      status: "pending",
      payment_status: "unpaid",
    });

    await logActivity(
      `New order placed for table ${newOrder.table_id}`,
      restaurant_id,
      "order"
    );

    // Emit real-time order creation event
    if (io) {
      io.emit("newOrder", newOrder);
    }

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { restaurant_id } = req.params;

    if (!restaurant_id) {
      return res.status(400).json({ message: "Restaurant ID is required." });
    }

    const orders = await Order.find({ restaurant_id })
      .populate("table_id", "table_number")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTableOrders = async (req, res) => {
  try {
    const { table_id, restaurant_id } = req.params;

    const orders = await Order.find({
      table_id,
      restaurant_id,
      payment_status: "unpaid" // Filter only unpaid orders
    }).sort({ createdAt: -1 });

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No unpaid orders found for this table." });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { order_id, restaurant_id } = req.params;
    const { status } = req.body;

    if (!["pending", "preparing", "served", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { _id: order_id, restaurant_id },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await logActivity(
      `Order ${status} for table ${order.table_id}`,
      restaurant_id,
      "status"
    );

    // Emit real-time order status update
    if (io) {
      io.emit("orderStatusUpdated", order);
    }

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { order_id, restaurant_id } = req.params;

    const order = await Order.findOneAndDelete({
      _id: order_id,
      restaurant_id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await logActivity(
      `Order deleted for table ${order.table_id}`,
      restaurant_id,
      "delete"
    );

    // Emit real-time order deletion
    if (io) {
      io.emit("orderDeleted", { order_id });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const markOrderAsPaid = async (req, res) => {
  const { orderId } = req.params;
  console.log("💡 Received orderId:", orderId);

  // Check if orderId is valid
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    console.log("❌ Invalid ObjectId");
    return res.status(400).json({ message: "Invalid order ID" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      console.log("❌ Order not found");
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("✅ Order found:", order);

    order.payment_status = 'paid'; // ✅ CORRECT
    await order.save();
    console.log("✅ Order status updated to 'paid'");

    if (order.id && order.restaurant_id) {
      console.log("ℹ️ Updating associated table:", order.table_id);
      const result = await Table.findOneAndUpdate(
        {
          number: order.table_id,
          restaurant_id: order.restaurant_id,
        },
        { status: "available" }
      );
      console.log("✅ Table updated:", result);
    } else {
      console.log("⚠️ Skipping table update: missing table_number or restaurant_id");
    }

    return res.status(200).json({ message: "Order marked as paid" });
  } catch (err) {
    console.error("❌ Backend error:", err.message);
    console.error(err.stack);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// PATCH /orders/pay-table/:restaurant_id/:table_id
const payAllTableOrders = async (req, res) => {
  try {
    const { restaurant_id, table_id } = req.params;

    const result = await Order.updateMany(
      {
        restaurant_id,
        table_id,
        payment_status: "unpaid"
      },
      {
        $set: { payment_status: "paid" }
      }
    );

    res.json({
      message: "All unpaid orders for this table marked as paid.",
      updated: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  setIO,
  placeOrder,
  getAllOrders,
  getTableOrders,
  updateOrderStatus,
  deleteOrder,
  markOrderAsPaid,
  payAllTableOrders
};
