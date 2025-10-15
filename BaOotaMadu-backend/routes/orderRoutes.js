const express = require("express");
const orderController = require("../controller/orderController");
const Order = require('../models/orderModel'); 
const mongoose = require("mongoose"); 

module.exports = function (io) {
  const router = express.Router();

  orderController.setIO(io);

  router.post("/:restaurant_id/place", orderController.placeOrder);
  router.get("/:restaurant_id", orderController.getAllOrders);
  router.put(
    "/:restaurant_id/:order_id/status",
    orderController.updateOrderStatus
  );
  router.delete("/:restaurant_id/:order_id", orderController.deleteOrder);
  router.patch("/:orderId/pay", orderController.markOrderAsPaid);
  router.patch(
    "/:restaurantId/:tokenNumber/complete",
    orderController.markOrderAsCompleted
  );
  // Add this new route
  router.get("/:restaurant_id/token/:tokenNumber", async (req, res) => {
    try {
      const { restaurant_id, tokenNumber } = req.params;
      const order = await Order.findOne({
        restaurant_id: new mongoose.Types.ObjectId(restaurant_id),
        tokenNumber: Number(tokenNumber),
      });
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.json([order]);
    } catch (err) {
      console.error("Fetch order by token error:", err);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  return router;
};
