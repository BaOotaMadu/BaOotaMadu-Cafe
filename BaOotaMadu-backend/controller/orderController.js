const Order = require("../models/orderModel");
const Activity = require("../models/activityModel");
const TokenCounter = require("../models/TokenCounter");
const dayjs = require("dayjs");
const mongoose = require("mongoose");
const googleTTS = require("google-tts-api");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// ✅ Force VLC in headless mode (Windows path, adjust if needed)
const player = require("play-sound")({
  player: "C:\\Program Files\\VideoLAN\\VLC\\vlc.exe",
});

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

// 🔊 Token announcer
async function announceToken(tokenNumber) {
  try {
    const text = `Token number ${tokenNumber}, please collect your order`;
    const url = googleTTS.getAudioUrl(text, {
      lang: "en",
      slow: false,
      host: "https://translate.google.com",
    });

    // Save audio file
    const filePath = path.resolve(__dirname, `token-${tokenNumber}.mp3`);
    const response = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, response.data);

    console.log(`✅ Saved audio for token ${tokenNumber} at ${filePath}`);

    // Play silently in background (VLC flags)
    player.play(
      filePath,
      { vlc: ["--intf", "dummy", "--play-and-exit"] },
      (err) => {
        if (err) console.error("❌ Error playing audio:", err);
        else console.log(`🔊 Announced token ${tokenNumber}`);
      }
    );
  } catch (err) {
    console.error("❌ announceToken error:", err.message);
  }
}

// 📌 Place new order
const placeOrder = async (req, res) => {
  try {
    const { restaurant_id, customer_name, order_items } = req.body;

    if (!order_items?.length) {
      return res
        .status(400)
        .json({ message: "At least one order item is required." });
    }

    // Step 1: Find or create today's counter
    const today = dayjs().format("YYYY-MM-DD");
    let counter = await TokenCounter.findOne({ date: today });

    if (!counter) {
      counter = await TokenCounter.create({ date: today, lastToken: 0 });
    }

    // Step 2: Increment token
    counter.lastToken += 1;
    await counter.save();

    // Step 3: Calculate order total
    const total_amount = order_items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Step 4: Create order with token
    const newOrder = await Order.create({
      restaurant_id,
      tokenNumber: counter.lastToken,
      customer_name,
      order_items,
      total_amount,
      status: "pending",
      payment_status: "unpaid",
    });

    await logActivity(
      `New order placed with token number ${newOrder.tokenNumber}`,
      restaurant_id,
      "order"
    );

    if (io) io.emit("newOrder", newOrder);

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("❌ placeOrder error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 Fetch all orders
const getAllOrders = async (req, res) => {
  try {
    //const { restaurant_id } = req.params;
    const restaurant_id = "68dbf720876cfd9ab51b9f6b";
    if (!restaurant_id) {
      return res.status(400).json({ message: "Restaurant ID is required." });
    }

    const orders = await Order.find({
      restaurant_id: new mongoose.Types.ObjectId(restaurant_id),
    })
      .populate("restaurant_id", "name")
      .sort({ created_at: -1 });

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this restaurant." });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get active token orders
const getTokenOrders = async (req, res) => {
  try {
    const { restaurant_id } = req.params;

    const orders = await Order.find({
      restaurant_id,
      status: { $ne: "completed" },
    }).sort({ created_at: -1 });

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No active orders found for this restaurant." });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Update order status
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

    if (!order) return res.status(404).json({ message: "Order not found" });

    // 🔊 Announce only when served
    if (status === "completed") {
      announceToken(order.tokenNumber);
    }

    await logActivity(
      `Order ${status} for token number ${order.tokenNumber}`,
      restaurant_id,
      "status"
    );

    if (io) io.emit("orderStatusUpdated", order);

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Delete order
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
      `Order deleted for token number ${order.tokenNumber}`,
      restaurant_id,
      "delete"
    );

    if (io) io.emit("orderDeleted", { order_id });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Mark order as paid
const markOrderAsPaid = async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.payment_status = "paid";
    await order.save();

    return res.status(200).json({ message: "Order marked as paid" });
  } catch (err) {
    console.error("❌ Backend error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Mark order as completed
const markOrderAsCompleted = async (req, res) => {
  const { restaurantId, tokenNumber } = req.params;

  try {
    const order = await Order.findOne({
      restaurant_id: restaurantId,
      tokenNumber: tokenNumber,
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "completed";
    await order.save();

    return res.status(200).json({ message: "Order marked as completed" });
  } catch (err) {
    console.error("❌ Backend error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  setIO,
  placeOrder,
  getAllOrders,
  getTokenOrders,
  updateOrderStatus,
  deleteOrder,
  markOrderAsPaid,
  markOrderAsCompleted,
};
