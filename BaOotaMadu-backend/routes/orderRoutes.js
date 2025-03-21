const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");

// Place a new order
router.post("/:restaurant_id/place", orderController.placeOrder);

// Get all orders
router.get("/:restaurant_id", orderController.getAllOrders);

// Get orders for a specific table
router.get("/:restaurant_id/table/:table_id", orderController.getTableOrders);

// Update order status
router.put("/:restaurant_id/:order_id/status", orderController.updateOrderStatus);

// Delete an order
router.delete("/:restaurant_id/:order_id", orderController.deleteOrder);

module.exports = router;
