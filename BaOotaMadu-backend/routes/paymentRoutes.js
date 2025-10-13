const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🧾 1️⃣ Create Razorpay Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount, // convert to paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

// 🧾 2️⃣ Verify Payment Signature
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

module.exports = router;
