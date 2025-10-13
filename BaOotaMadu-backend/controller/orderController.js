const Order = require("../models/orderModel");
const Activity = require("../models/activityModel");
const TokenCounter = require("../models/TokenCounter");
const dayjs = require("dayjs");
const mongoose = require("mongoose");
const googleTTS = require("google-tts-api");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// ✅ Windows VLC path (escaped) and args for headless mode
const player = require("play-sound")({
  player: "C:/Program Files/VideoLAN/VLC/vlc.exe",
});

let io;

const setIO = (ioInstance) => {
  io = ioInstance;
};

// Log activity and emit to frontend
const logActivity = async (message, restaurant_id, type = "info") => {
  const activity = {
    message,
    restaurant_id,
    type,
    time: new Date(),
  };

  if (io) io.emit("updateRecent", activity);
  await Activity.create(activity);
};

// 🔁 Fetch TTS audio with retry
async function fetchAudioWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      return response.data;
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`Retrying TTS fetch... attempt ${i + 1}`);
      await new Promise((r) => setTimeout(r, 500)); // wait 500ms
    }
  }
}

function playAudioAndDelete(filePath) {
  player.play(
    filePath,
    {
      args: [
        "--intf",
        "dummy", // headless
        "--play-and-exit",
        "--no-video", // prevent any video window
      ],
    },
    (err) => {
      if (err) {
        console.error("❌ Error playing audio:", err);
      } else {
        console.log("🔊 Audio played successfully, deleting file...");
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.warn("⚠️ Failed to delete audio file:", unlinkErr);
          } else {
            console.log("✅ Audio file deleted");
          }
        });
      }
    }
  );
}
//bvackground audio play
function playAudioSilently(filePath) {
  player.play(
    filePath,
    {
      // VLC arguments for headless mode
      args: [
        "--intf",
        "dummy", // dummy interface, no GUI
        "--play-and-exit", // exit after playback
        "--no-video", // don't show video
        "--quiet", // suppress console messages
        "--no-qt-name-in-title", // prevent Qt window title
        "--no-embedded-video", // prevent any embedded window
        "--no-snapshot-preview", // don't preview video frames
        "--no-media-library", // disable media library
        "--no-skins",
      ],
    },
    (err) => {
      if (err) console.error("❌ Error playing audio:", err);
    }
  );
}
async function announceToken(tokenNumber) {
  try {
    const text = `Token number ${tokenNumber}, please collect your order`;
    const url = googleTTS.getAudioUrl(text, { lang: "en", slow: false });

    const filePath = path.resolve(__dirname, `token-${tokenNumber}.mp3`);

    const audioData = await fetchAudioWithRetry(url);
    fs.writeFileSync(filePath, audioData);
    console.log(`✅ Saved audio for token ${tokenNumber} at ${filePath}`);

    // Play via VLC and delete after playback
    playAudioAndDelete(filePath);
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

    // Step 3: Calculate total
    const total_amount = order_items.reduce(
      (sum, item) =>
        sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0
    );

    // Step 4: Create order
    const newOrder = await Order.create({
      restaurant_id: new mongoose.Types.ObjectId(restaurant_id),
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
    const { restaurant_id } = req.params;

    if (!restaurant_id) {
      return res.status(400).json({ message: "Restaurant ID is required." });
    }

    const orders = await Order.find({
      restaurant_id: new mongoose.Types.ObjectId(restaurant_id),
    })
      .populate("restaurant_id", "name")
      .sort({ createdAt: -1 });

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this restaurant." });
    }

    res.json(orders);
  } catch (error) {
    console.error("❌ getAllOrders error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get active token orders
const getTokenOrders = async (req, res) => {
  try {
    const { restaurant_id } = req.params;

    if (!restaurant_id) {
      return res.status(400).json({ message: "Restaurant ID is required." });
    }

    const orders = await Order.find({
      restaurant_id: new mongoose.Types.ObjectId(restaurant_id),
      status: { $ne: "completed" },
    }).sort({ createdAt: -1 });

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No active orders found for this restaurant." });
    }

    res.json(orders);
  } catch (error) {
    console.error("❌ getTokenOrders error:", error);
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
      {
        _id: order_id,
        restaurant_id: new mongoose.Types.ObjectId(restaurant_id),
      },
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    // 🔊 Announce only when completed
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
    console.error("❌ updateOrderStatus error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 Delete order
const deleteOrder = async (req, res) => {
  try {
    const { order_id, restaurant_id } = req.params;

    const order = await Order.findOneAndDelete({
      _id: order_id,
      restaurant_id: new mongoose.Types.ObjectId(restaurant_id),
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
    console.error("❌ deleteOrder error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 Mark order as paid
const markOrderAsPaid = async (req, res) => {
  const { order_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(order_id)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  try {
    const order = await Order.findById(order_id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.payment_status = "paid";
    await order.save();

    return res.status(200).json({ message: "Order marked as paid", order });
  } catch (err) {
    console.error("❌ markOrderAsPaid error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 📌 Mark order as completed (by restaurant ID & token number)
const markOrderAsCompleted = async (req, res) => {
  const { restaurant_id, tokenNumber } = req.params;

  try {
    const order = await Order.findOne({
      restaurant_id: new mongoose.Types.ObjectId(restaurant_id),
      tokenNumber: Number(tokenNumber),
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "completed";
    await order.save();

    // Announce token safely
    announceToken(order.tokenNumber);

    return res
      .status(200)
      .json({ message: "Order marked as completed", order });
  } catch (err) {
    console.error("❌ markOrderAsCompleted error:", err.message);
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
