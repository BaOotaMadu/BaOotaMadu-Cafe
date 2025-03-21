const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getAllOrders,
  getTableOrders,
  updateOrderStatus,
  deleteOrder
} = require("../controller/orderController");

router.post("/placeorder", placeOrder); // Place an order
router.get("/getorders", getAllOrders); // Get all orders
router.get("/table/:table_id", getTableOrders); // Get orders for a specific table
router.put("/updatestatus/:order_id", updateOrderStatus); // Update order status
router.delete("/delete/:order_id", deleteOrder); // Delete an order

module.exports = router;
