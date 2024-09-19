const { Router } = require("express");
const {
  createOrder,
  cancelOrder,
  getOrders,
  getOrderDetail,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
} = require("../controllers/order/order.controller");

const router = Router();

router.post("/", createOrder);

router.get("/get-orders", getOrders);

router.get("/:id", getOrderDetail);

router.put("/update-status/:id", updateOrderStatus);

router.put("/cancel-order/:id", cancelOrder);

router.put("/update/:id", updateOrder);

router.delete("/delete/:id", deleteOrder);

module.exports = router;
