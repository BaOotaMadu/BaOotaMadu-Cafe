const Order = require("../models/orderModel");
const Table = require("../models/tableModel");
const Activity = require("../models/activityModel");

let io; // Socket.IO instance holder

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
    io.emit("updateRecent", activity);
  }

  await Activity.create(activity); // Save to DB
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

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
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

    const orders = await Order.find({ table_id, restaurant_id }).sort({
      createdAt: -1,
    });

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this table." });
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

    res.json({ message: "Order deleted successfully" });
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
};
