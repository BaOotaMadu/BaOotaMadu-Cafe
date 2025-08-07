const express = require("express");
const orderController = require("../controller/orderController");

module.exports = function (io) {
  const router = express.Router();

  orderController.setIO(io);

  router.post("/:restaurant_id/place", orderController.placeOrder);
  router.get("/:restaurant_id", orderController.getAllOrders);
  router.get("/:restaurant_id/table/:table_id", orderController.getTableOrders);
  router.put("/:restaurant_id/:order_id/status", orderController.updateOrderStatus);
  router.delete("/:restaurant_id/:order_id", orderController.deleteOrder);
  router.patch("/:orderId/pay", orderController.markOrderAsPaid);

  return router;
};
