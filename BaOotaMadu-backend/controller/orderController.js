const Order = require("../models/orderModel");
const Table = require("../models/tableModel");
const mongoose = require("mongoose");
exports.placeOrder = async (req, res) => {
  try {
    const { restaurant_id, table_id, customer_name, order_items } = req.body;

    if (!table_id || !order_items.length) {
      return res.status(400).json({ message: "Table ID and order items are required." });
    }

    // Calculate total amount
    const total_amount = order_items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const newOrder = await Order.create({
      restaurant_id,
      table_id,
      customer_name,
      order_items,
      total_amount,
      status: "pending",
      payment_status: "unpaid"
    });


    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("table_id", "table_number") // Get table number
      .sort({ created_at: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getTableOrders = async (req, res) => {
  try {
    const { table_id } = req.params;
    const orders = await Order.find({ table_id }).sort({ created_at: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this table." });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    if (!["pending", "preparing", "served", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(order_id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findByIdAndDelete(order_id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
